// SplitMovesFromKantoCsv.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include <sstream>
#include <fstream>
#include <string>
#include <algorithm>


using namespace std;

int main()
{
	//define vars and consts
	const string inputFileName{ "Kanto.csv" };
	const string outputFileName{ "PokemonLearnableMoveNames.csv"};

	//open files
	ifstream inFile{};
	ofstream outFile{};
	inFile.open(inputFileName);
	outFile.open(outputFileName, fstream::trunc);

	string line;
	getline(inFile, line); //the first line is the headers. Ignore it
	outFile << "pokemon, attack" << endl;
	while (getline(inFile, line)) {
		stringstream record{ line };

		//get the pokemon's name (first column)
		string pokemonName;
		record >> pokemonName;
		pokemonName = pokemonName.substr(0, pokemonName.length() - 1); //remove the comma from the end of the string

		//get the move names (second column)
		string token;
		while (record >> token) {
			//first token in each pair is the actual attack name + punctuation
			int start = token.find_first_of('\'') + 1;
			int end = token.find_last_of('\'');
			string attack = token.substr(start, end - start);
			replace(attack.begin(), attack.end(), '-', ' ');
			outFile << pokemonName << "," << attack << endl;

			//second token in each pair is the attack type, which we have elsewhere. Skip over it
			record >> token;
		}
	}

	//close files
	inFile.close();
	outFile.close();
}

// Run program: Ctrl + F5 or Debug > Start Without Debugging menu
// Debug program: F5 or Debug > Start Debugging menu

// Tips for Getting Started: 
//   1. Use the Solution Explorer window to add/manage files
//   2. Use the Team Explorer window to connect to source control
//   3. Use the Output window to see build output and other messages
//   4. Use the Error List window to view errors
//   5. Go to Project > Add New Item to create new code files, or Project > Add Existing Item to add existing code files to the project
//   6. In the future, to open this project again, go to File > Open > Project and select the .sln file
