using MySql.Data.MySqlClient;

class Program
{
    static MySqlConnection conn = new MySqlConnection();
    static MySqlCommand userCmd, myPokemonCmd, currentAttacksCmd, getLearnableAttacksCmd;

    const int MAX_PID = 750;
    const int MAX_AID = 96;

    public static void LogCommand(MySqlCommand cmd)
{   
    string cmdText = cmd.CommandText;
    
    foreach(MySqlParameter p in cmd.Parameters)
    {
        cmdText = cmdText.Replace(p.ParameterName, p.Value.ToString());
    }

    Console.WriteLine(cmdText);
}

    static void SetUpCommands()
    {

        //define commands
        userCmd = new MySqlCommand();
        userCmd.Connection = conn;
        userCmd.CommandText = "INSERT INTO user (uID, name, tradeCount, username, password)"
            + "VALUES (@uid, @name, @tradeCount, @username, @password);";
        //userCmd.CommandType = System.Data.CommandType.Text;
        //userCmd.Prepare();

        myPokemonCmd = new MySqlCommand();
        myPokemonCmd.Connection = conn;
        myPokemonCmd.CommandText = "INSERT INTO mypokemon (pid, uid, nickname, level, favourite, onteam, showcase, dateAdded)"
            + "VALUES(@pid, @uid, @nickname, @level, @fav, @team, @show, NOW());"
            + "SELECT instanceID FROM myPokemon WHERE pid = @pid AND uid = @uid AND nickname = @nickname;";
        //myPokemonCmd.CommandType = System.Data.CommandType.Text;
        //myPokemonCmd.Prepare();

        currentAttacksCmd = new MySqlCommand();
        currentAttacksCmd.Connection = conn;
        currentAttacksCmd.CommandText = "INSERT INTO currentAttacks (instanceID, aID) VALUES(@iid, @aid);";
        //currentAttacksCmd.CommandType = System.Data.CommandType.Text;
        //currentAttacksCmd.Prepare();

        getLearnableAttacksCmd = new MySqlCommand();
        getLearnableAttacksCmd.Connection = conn;
        getLearnableAttacksCmd.CommandText = "SELECT aID FROM learnableAttacks WHERE pID = @pid";
        //getLearnableAttacksCmd.CommandType = System.Data.CommandType.Text;
        //getLearnableAttacksCmd.Prepare();
    }

    static void AddUser(int id)
    {
        userCmd.Parameters.Clear();
        userCmd.Parameters.AddWithValue("@uid", id);
        userCmd.Parameters.AddWithValue("@name", "Name" + id);
        userCmd.Parameters.AddWithValue("@tradeCount", 0);
        userCmd.Parameters.AddWithValue("@username", "User" + id);
        userCmd.Parameters.AddWithValue("@password", "Pa$$word" + id);

        try
        {
            userCmd.ExecuteNonQuery();
        } catch
        {
            throw;
        }
    }

    static int AddPokemon(int pid, int uid, int level, bool fav, bool team, bool show)
    {
        //takes parameters for a pokemon instance, inserts it into the database, and returns the instanceId for the new pokemon instance
        myPokemonCmd.Parameters.Clear();
        myPokemonCmd.Parameters.AddWithValue("@pid", pid);
        myPokemonCmd.Parameters.AddWithValue("@uid", uid);
        myPokemonCmd.Parameters.AddWithValue("@level", level);
        myPokemonCmd.Parameters.AddWithValue("@fav", fav? 1: 0);
        myPokemonCmd.Parameters.AddWithValue("@team", team? 1: 0);
        myPokemonCmd.Parameters.AddWithValue("@show", show? 1: 0);
        myPokemonCmd.Parameters.AddWithValue("@nickname", "Nickname" + (pid + uid));

        int instanceId = 0;
        try
        {
            MySqlDataReader reader = myPokemonCmd.ExecuteReader();
            while (reader.Read())
            {
                instanceId = (int)reader[0];
            }
            reader.Close();
        } catch
        {
            throw;
        }

        return instanceId;
    }

    static void AddAttack(int iid, int aid)
    {
        currentAttacksCmd.Parameters.Clear();
        currentAttacksCmd.Parameters.AddWithValue("@iid", iid);
        currentAttacksCmd.Parameters.AddWithValue("@aid", aid);
        try
        {
            Console.WriteLine(currentAttacksCmd.CommandText);
            foreach (MySqlParameter p in currentAttacksCmd.Parameters)
            {
                Console.WriteLine($"{p.ParameterName}: {p.Value}");
            }
            currentAttacksCmd.ExecuteNonQuery();
        } catch
        {
            throw;
        }
    }

    static List<int> GetLearnableAttacks(int pid)
    {
        getLearnableAttacksCmd.Parameters.Clear();
        getLearnableAttacksCmd.Parameters.AddWithValue("@pid", pid);
        List<int> attacks = new List<int>();
        try
        {
            MySqlDataReader reader = getLearnableAttacksCmd.ExecuteReader();
            while (reader.Read())
            {
                attacks.Add((int)reader[0]);
            }
            reader.Close();
        } catch
        {
            throw;
        }

        return attacks;
    }
    static void Main()
    {

        try
        {
            //open a connection to the database
            conn.ConnectionString = "server=localhost;port=3306;database=pokedex;uid=root;pwd=MK4766ve!!";
            conn.Open();
            SetUpCommands();

            //generate 100 users, each with some pokemon instances
            for (int uid = 1; uid <= 100; uid++)
            {
                AddUser(uid); //create a new user with the given id

                //give the user some pokemon instances
                int numPokemon = uid / 4;
                for (int j = 0; j < numPokemon; j++)
                {
                    int pid = (uid + j).GetHashCode() % MAX_PID; //choose a pokemon species in an evenly-distributed, but deterministic way
                    int iid = AddPokemon(pid, uid, uid, pid % 2 == 0, j < 6, 3 <= j && j < 9);

                    //give the pokemon some attacks
                    //get a list of the pokemon's learnable attacks
                    List<int> learnableAttacks = GetLearnableAttacks(pid);

                    int numAttacks = Math.Min(uid % 5, learnableAttacks.Count()); //choose 0-4 attacks from the list
                    for (int k = 0; k < numAttacks; k++)
                    {
                        int aid = learnableAttacks[k.GetHashCode() % learnableAttacks.Count()];
                        AddAttack(iid, aid);
                    }
                }


            }



            conn.Close();
            
        } catch (Exception ex)
        {
            throw;
            Console.WriteLine(ex.Message);
        }

    }
}
