using MySql.Data.MySqlClient;
using System.Net.NetworkInformation;
using System.Reflection;

//open a connection to the database
MySqlConnection conn = new MySqlConnection();
conn.ConnectionString = "server=localhost;port=3306;database=pokedex;uid=root;pwd=MK4766ve!!";
conn.Open();

MySqlCommand lastInsertQuery = new MySqlCommand("SELECT LAST_INSERT_ID();", conn);
lastInsertQuery.Prepare();

int listPokemon(int iid)
{
    Console.WriteLine($"Listing pokemon {iid} for trade.");
    string listString =
        "INSERT INTO Listing (instanceID, sellerID, description) " +
        $"SELECT instanceID, uid AS sellerID, 'description{iid}' " +
        $"FROM MyPokemon WHERE instanceID = {iid}; ";

    MySqlCommand listCommand = new MySqlCommand(listString, conn);

    string idString =
        "SELECT MAX(listingID) FROM Listing " +
        $"WHERE instanceID = {iid} " +
        $"GROUP BY instanceID; ";
    MySqlCommand idCommand = new MySqlCommand(idString, conn);

    int id;
    int temp = listCommand.ExecuteNonQuery();
    using (MySqlDataReader reader = idCommand.ExecuteReader())
    {
        reader.Read();
        id = reader.GetInt32(0);
    }
    return id;
}

int reply(int lid, int iid)
{
    Console.WriteLine($"Replying to listing {lid} with pokemon {iid}");
    string replyString =
        "INSERT INTO Reply(listingID, instanceID, respondantID, message) " +
        $"SELECT {lid} AS listingID, {iid} AS instanceID, uid AS respondantID, 'message{iid}' AS message " +
        $"FROM myPokemon " +
        $"WHERE instanceID = {iid}; ";
    MySqlCommand replyCommand = new MySqlCommand(replyString, conn);

    string idString =
        "SELECT MAX(replyID) " +
        "FROM Reply " +
        $"WHERE listingID = {lid} AND instanceID = {iid} " +
        $"GROUP BY listingID, instanceID; ";
    MySqlCommand idCommand = new MySqlCommand(idString, conn);

    int id;
    replyCommand.ExecuteNonQuery();
    using (MySqlDataReader reader = idCommand.ExecuteReader())
    {
        reader.Read();
        id = reader.GetInt32(0);
    }
    return id;
}

List<int> getReplies(int lid)
{
    Console.WriteLine($"GettingReplies for listing {lid}");
    string sql =
        "SELECT replyID " +
        "FROM Reply JOIN Listing ON Reply.ListingID = Listing.listingID " +
        $"WHERE Listing.listingID = {lid}; ";
    MySqlCommand command = new MySqlCommand(sql, conn);

    List<int> replies = new List<int>();
    using (MySqlDataReader reader = command.ExecuteReader())
    {
        while (reader.Read())
        {
            replies.Add((int)reader[0]);
        }
    }
    return replies;
}

void doTrade(int rid)
{
    Console.WriteLine("Accepting trade offer " + rid);
    string sql = $"CALL doTrade({rid}); ";
    MySqlCommand command = new MySqlCommand(sql , conn);

    command.ExecuteNonQuery();
}

int nextPrime(int prev)
{
    if (prev < 2) return 2;
    if (prev < 3) return 3;
    if (prev < 5) return 5;
    if (prev < 7) return 7;
    if (prev < 11) return 11;
    if (prev < 13) return 13;
    if (prev < 17) return 17;
    if (prev < 19) return 19;
    if (prev < 23) return 23;
    if (prev < 29) return 29;
    if (prev < 31) return 31;
    else throw new Exception("Need more prime numbers.");
}


const int MAX_IID = 1225;
int n = 7;
int m = 3;
List<int> listedPokemon = new List<int>();
List<int> listingIDs = new List<int>();

while (n < 20)
{
    //list every n'th pokemon (without double-listing)
    for (int i = n; i <  MAX_IID; i += n)
    {
        if (!listedPokemon.Contains(i))
        {
            listedPokemon.Add(i);
            listingIDs.Add(listPokemon(i));
        }

    }

    // send every m'th pokemon as a reply
    for (int j = m; j < MAX_IID; j += m)
    {
        reply(listingIDs[j % listingIDs.Count()], j);
    }

    //accept an offer for every m/2'th listing
    for (int i = 0; i < listingIDs.Count(); i += m / 2)
    {
        List<int> replies = getReplies(listingIDs[i]);
        if (replies.Count() > 0)
        {
            doTrade(replies[0]);
            listingIDs.RemoveAt(i);
        }
    }

    n += 2;
    m++;
}

