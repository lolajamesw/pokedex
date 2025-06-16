-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: pokedexbackup
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attacks`
--

DROP TABLE IF EXISTS `attacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attacks` (
  `aID` int NOT NULL,
  `attack_name` varchar(50) NOT NULL,
  `type` varchar(10) NOT NULL,
  `category` varchar(20) DEFAULT NULL,
  `power` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `PP` int DEFAULT NULL,
  `effect` varchar(100) NOT NULL,
  PRIMARY KEY (`aID`),
  KEY `type` (`type`),
  CONSTRAINT `attacks_ibfk_1` FOREIGN KEY (`type`) REFERENCES `types` (`type`),
  CONSTRAINT `attacks_chk_1` CHECK (((`power` >= 0) and (`accuracy` >= 0) and (`PP` >= 0)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attacks`
--

LOCK TABLES `attacks` WRITE;
/*!40000 ALTER TABLE `attacks` DISABLE KEYS */;
/*!40000 ALTER TABLE `attacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `currentattacks`
--

DROP TABLE IF EXISTS `currentattacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `currentattacks` (
  `pID` int NOT NULL,
  `instanceID` int NOT NULL,
  `uID` int NOT NULL,
  `aID` int NOT NULL,
  PRIMARY KEY (`pID`,`instanceID`,`uID`,`aID`),
  KEY `aID` (`aID`),
  CONSTRAINT `currentattacks_ibfk_1` FOREIGN KEY (`aID`) REFERENCES `attacks` (`aID`),
  CONSTRAINT `currentattacks_ibfk_2` FOREIGN KEY (`pID`, `instanceID`, `uID`) REFERENCES `mypokemon` (`pID`, `instanceID`, `uID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `currentattacks`
--

LOCK TABLES `currentattacks` WRITE;
/*!40000 ALTER TABLE `currentattacks` DISABLE KEYS */;
/*!40000 ALTER TABLE `currentattacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evolutions`
--

DROP TABLE IF EXISTS `evolutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evolutions` (
  `pIDfrom` int NOT NULL,
  `pIDinto` int NOT NULL,
  PRIMARY KEY (`pIDfrom`,`pIDinto`),
  KEY `pIDinto` (`pIDinto`),
  CONSTRAINT `evolutions_ibfk_1` FOREIGN KEY (`pIDfrom`) REFERENCES `pokedex` (`pID`),
  CONSTRAINT `evolutions_ibfk_2` FOREIGN KEY (`pIDinto`) REFERENCES `pokedex` (`pID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evolutions`
--

LOCK TABLES `evolutions` WRITE;
/*!40000 ALTER TABLE `evolutions` DISABLE KEYS */;
/*!40000 ALTER TABLE `evolutions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_members`
--

DROP TABLE IF EXISTS `group_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `favourite_colour` varchar(45) DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_members`
--

LOCK TABLES `group_members` WRITE;
/*!40000 ALTER TABLE `group_members` DISABLE KEYS */;
INSERT INTO `group_members` VALUES (1,'Mya','Kay','pink'),(2,'Jasmine','Yip','red'),(3,'Lola','James','purple'),(4,'Mahdee','Khandokar','black');
/*!40000 ALTER TABLE `group_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `learnableattacks`
--

DROP TABLE IF EXISTS `learnableattacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `learnableattacks` (
  `pID` int NOT NULL,
  `aID` int NOT NULL,
  PRIMARY KEY (`pID`,`aID`),
  KEY `aID` (`aID`),
  CONSTRAINT `learnableattacks_ibfk_1` FOREIGN KEY (`pID`) REFERENCES `pokedex` (`pID`),
  CONSTRAINT `learnableattacks_ibfk_2` FOREIGN KEY (`aID`) REFERENCES `attacks` (`aID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learnableattacks`
--

LOCK TABLES `learnableattacks` WRITE;
/*!40000 ALTER TABLE `learnableattacks` DISABLE KEYS */;
/*!40000 ALTER TABLE `learnableattacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `market`
--

DROP TABLE IF EXISTS `market`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `market` (
  `offered_pokemon_id` int NOT NULL,
  `offered_pokemon_instance_id` int NOT NULL,
  `offering_user_id` int NOT NULL,
  `request_description` varchar(100) DEFAULT NULL,
  `reply_pokemon_id` int NOT NULL,
  `reply_pokemon_instance_id` int NOT NULL,
  `reply_user_id` int NOT NULL,
  KEY `offered_pokemon_id` (`offered_pokemon_id`,`offered_pokemon_instance_id`,`offering_user_id`),
  KEY `reply_pokemon_id` (`reply_pokemon_id`,`reply_pokemon_instance_id`,`reply_user_id`),
  CONSTRAINT `market_ibfk_1` FOREIGN KEY (`offered_pokemon_id`, `offered_pokemon_instance_id`, `offering_user_id`) REFERENCES `mypokemon` (`pID`, `instanceID`, `uID`),
  CONSTRAINT `market_ibfk_2` FOREIGN KEY (`reply_pokemon_id`, `reply_pokemon_instance_id`, `reply_user_id`) REFERENCES `mypokemon` (`pID`, `instanceID`, `uID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `market`
--

LOCK TABLES `market` WRITE;
/*!40000 ALTER TABLE `market` DISABLE KEYS */;
/*!40000 ALTER TABLE `market` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mypokemon`
--

DROP TABLE IF EXISTS `mypokemon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mypokemon` (
  `pID` int NOT NULL,
  `uID` int NOT NULL,
  `instanceID` int NOT NULL,
  `nickname` varchar(30) DEFAULT NULL,
  `level` int DEFAULT NULL,
  `favourite` bit(1) DEFAULT NULL,
  `onteam` bit(1) DEFAULT NULL,
  `showcase` bit(1) DEFAULT NULL,
  PRIMARY KEY (`pID`,`instanceID`,`uID`),
  KEY `uID` (`uID`),
  CONSTRAINT `mypokemon_ibfk_1` FOREIGN KEY (`pID`) REFERENCES `pokedex` (`pID`),
  CONSTRAINT `mypokemon_ibfk_2` FOREIGN KEY (`uID`) REFERENCES `user` (`uID`),
  CONSTRAINT `mypokemon_chk_1` CHECK ((`level` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mypokemon`
--

LOCK TABLES `mypokemon` WRITE;
/*!40000 ALTER TABLE `mypokemon` DISABLE KEYS */;
/*!40000 ALTER TABLE `mypokemon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pokedex`
--

DROP TABLE IF EXISTS `pokedex`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pokedex` (
  `pID` int NOT NULL,
  `name` varchar(40) NOT NULL,
  `type1` varchar(10) NOT NULL,
  `type2` varchar(10) DEFAULT NULL,
  `hp` int NOT NULL,
  `atk` int NOT NULL,
  `def` int NOT NULL,
  `spAtk` int NOT NULL,
  `spDef` int NOT NULL,
  `speed` int NOT NULL,
  `legendary` bit(1) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`pID`),
  KEY `type1` (`type1`),
  KEY `type2` (`type2`),
  CONSTRAINT `pokedex_ibfk_1` FOREIGN KEY (`type1`) REFERENCES `types` (`type`),
  CONSTRAINT `pokedex_ibfk_2` FOREIGN KEY (`type2`) REFERENCES `types` (`type`),
  CONSTRAINT `pokedex_chk_1` CHECK (((`HP` >= 0) and (`atk` >= 0) and (`def` >= 0) and (`spAtk` >= 0) and (`spDef` >= 0) and (`speed` >= 0)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pokedex`
--

LOCK TABLES `pokedex` WRITE;
/*!40000 ALTER TABLE `pokedex` DISABLE KEYS */;
/*!40000 ALTER TABLE `pokedex` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trades`
--

DROP TABLE IF EXISTS `trades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trades` (
  `trade_id` int NOT NULL,
  `seller_pokemon_id` int NOT NULL,
  `seller_pokemon_instance_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `buyer_id` int DEFAULT NULL,
  `buyer_pokemon_id` int DEFAULT NULL,
  `buyer_pokemon_instance_id` int DEFAULT NULL,
  `status` varchar(15) NOT NULL,
  PRIMARY KEY (`trade_id`),
  KEY `seller_pokemon_id` (`seller_pokemon_id`,`seller_pokemon_instance_id`,`seller_id`),
  CONSTRAINT `trades_ibfk_1` FOREIGN KEY (`seller_pokemon_id`, `seller_pokemon_instance_id`, `seller_id`) REFERENCES `mypokemon` (`pID`, `instanceID`, `uID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trades`
--

LOCK TABLES `trades` WRITE;
/*!40000 ALTER TABLE `trades` DISABLE KEYS */;
/*!40000 ALTER TABLE `trades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `typefx`
--

DROP TABLE IF EXISTS `typefx`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `typefx` (
  `type1` varchar(10) NOT NULL,
  `type2` varchar(10) NOT NULL,
  `double_strength` bit(1) NOT NULL,
  `half_strength` bit(1) NOT NULL,
  `no_impact` bit(1) NOT NULL,
  PRIMARY KEY (`type1`,`type2`),
  KEY `type2` (`type2`),
  CONSTRAINT `typefx_ibfk_1` FOREIGN KEY (`type1`) REFERENCES `types` (`type`),
  CONSTRAINT `typefx_ibfk_2` FOREIGN KEY (`type2`) REFERENCES `types` (`type`),
  CONSTRAINT `typefx_chk_1` CHECK ((((`half_strength` + `double_strength`) + `no_impact`) = 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `typefx`
--

LOCK TABLES `typefx` WRITE;
/*!40000 ALTER TABLE `typefx` DISABLE KEYS */;
INSERT INTO `typefx` VALUES ('Bug','Fighting',_binary '\0',_binary '',_binary '\0'),('Bug','Fire',_binary '\0',_binary '',_binary '\0'),('Bug','Flying',_binary '\0',_binary '',_binary '\0'),('Bug','Ghost',_binary '\0',_binary '',_binary '\0'),('Bug','Grass',_binary '',_binary '\0',_binary '\0'),('Bug','Poison',_binary '',_binary '\0',_binary '\0'),('Bug','Psychic',_binary '',_binary '\0',_binary '\0'),('Dragon','Dragon',_binary '',_binary '\0',_binary '\0'),('Electric','Dragon',_binary '\0',_binary '',_binary '\0'),('Electric','Electric',_binary '\0',_binary '',_binary '\0'),('Electric','Flying',_binary '',_binary '\0',_binary '\0'),('Electric','Grass',_binary '\0',_binary '',_binary '\0'),('Electric','Ground',_binary '\0',_binary '\0',_binary ''),('Electric','Water',_binary '',_binary '\0',_binary '\0'),('Fighting','Bug',_binary '\0',_binary '',_binary '\0'),('Fighting','Flying',_binary '\0',_binary '',_binary '\0'),('Fighting','Ghost',_binary '\0',_binary '\0',_binary ''),('Fighting','Ice',_binary '',_binary '\0',_binary '\0'),('Fighting','Normal',_binary '',_binary '\0',_binary '\0'),('Fighting','Poison',_binary '\0',_binary '',_binary '\0'),('Fighting','Psychic',_binary '\0',_binary '',_binary '\0'),('Fighting','Rock',_binary '',_binary '\0',_binary '\0'),('Fire','Bug',_binary '',_binary '\0',_binary '\0'),('Fire','Dragon',_binary '\0',_binary '',_binary '\0'),('Fire','Fire',_binary '\0',_binary '',_binary '\0'),('Fire','Grass',_binary '',_binary '\0',_binary '\0'),('Fire','Ice',_binary '',_binary '\0',_binary '\0'),('Fire','Rock',_binary '\0',_binary '',_binary '\0'),('Fire','Water',_binary '\0',_binary '',_binary '\0'),('Flying','Bug',_binary '',_binary '\0',_binary '\0'),('Flying','Electric',_binary '\0',_binary '',_binary '\0'),('Flying','Fighting',_binary '',_binary '\0',_binary '\0'),('Flying','Grass',_binary '',_binary '\0',_binary '\0'),('Flying','Rock',_binary '\0',_binary '',_binary '\0'),('Ghost','Ghost',_binary '',_binary '\0',_binary '\0'),('Ghost','Normal',_binary '\0',_binary '\0',_binary ''),('Ghost','Psychic',_binary '\0',_binary '\0',_binary ''),('Grass','Bug',_binary '\0',_binary '',_binary '\0'),('Grass','Dragon',_binary '\0',_binary '',_binary '\0'),('Grass','Fire',_binary '\0',_binary '',_binary '\0'),('Grass','Flying',_binary '\0',_binary '',_binary '\0'),('Grass','Grass',_binary '\0',_binary '',_binary '\0'),('Grass','Ground',_binary '',_binary '\0',_binary '\0'),('Grass','Poison',_binary '\0',_binary '',_binary '\0'),('Grass','Rock',_binary '',_binary '\0',_binary '\0'),('Grass','Water',_binary '',_binary '\0',_binary '\0'),('Ground','Bug',_binary '\0',_binary '',_binary '\0'),('Ground','Electric',_binary '',_binary '\0',_binary '\0'),('Ground','Fire',_binary '',_binary '\0',_binary '\0'),('Ground','Flying',_binary '\0',_binary '\0',_binary ''),('Ground','Grass',_binary '\0',_binary '',_binary '\0'),('Ground','Poison',_binary '',_binary '\0',_binary '\0'),('Ground','Rock',_binary '',_binary '\0',_binary '\0'),('Ice','Dragon',_binary '',_binary '\0',_binary '\0'),('Ice','Flying',_binary '',_binary '\0',_binary '\0'),('Ice','Grass',_binary '',_binary '\0',_binary '\0'),('Ice','Ground',_binary '',_binary '\0',_binary '\0'),('Ice','Ice',_binary '\0',_binary '',_binary '\0'),('Ice','Water',_binary '\0',_binary '',_binary '\0'),('Normal','Ghost',_binary '\0',_binary '\0',_binary ''),('Normal','Rock',_binary '\0',_binary '',_binary '\0'),('Poison','Bug',_binary '',_binary '\0',_binary '\0'),('Poison','Ghost',_binary '\0',_binary '',_binary '\0'),('Poison','Grass',_binary '',_binary '\0',_binary '\0'),('Poison','Ground',_binary '\0',_binary '',_binary '\0'),('Poison','Poison',_binary '\0',_binary '',_binary '\0'),('Poison','Rock',_binary '\0',_binary '',_binary '\0'),('Psychic','Fighting',_binary '',_binary '\0',_binary '\0'),('Psychic','Poison',_binary '',_binary '\0',_binary '\0'),('Psychic','Psychic',_binary '\0',_binary '',_binary '\0'),('Rock','Bug',_binary '',_binary '\0',_binary '\0'),('Rock','Fighting',_binary '\0',_binary '',_binary '\0'),('Rock','Fire',_binary '',_binary '\0',_binary '\0'),('Rock','Flying',_binary '',_binary '\0',_binary '\0'),('Rock','Ground',_binary '\0',_binary '',_binary '\0'),('Rock','Ice',_binary '',_binary '\0',_binary '\0'),('Water','Dragon',_binary '\0',_binary '',_binary '\0'),('Water','Fire',_binary '',_binary '\0',_binary '\0'),('Water','Grass',_binary '\0',_binary '',_binary '\0'),('Water','Ground',_binary '',_binary '\0',_binary '\0'),('Water','Rock',_binary '',_binary '\0',_binary '\0'),('Water','Water',_binary '\0',_binary '',_binary '\0');
/*!40000 ALTER TABLE `typefx` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `types`
--

DROP TABLE IF EXISTS `types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `types` (
  `type` varchar(10) NOT NULL,
  PRIMARY KEY (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `types`
--

LOCK TABLES `types` WRITE;
/*!40000 ALTER TABLE `types` DISABLE KEYS */;
INSERT INTO `types` VALUES ('Bug'),('Dragon'),('Electric'),('Fighting'),('Fire'),('Flying'),('Ghost'),('Grass'),('Ground'),('Ice'),('Normal'),('Poison'),('Psychic'),('Rock'),('Water');
/*!40000 ALTER TABLE `types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `uID` int NOT NULL,
  `name` varchar(40) NOT NULL,
  `tradeCount` int NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(20) NOT NULL,
  PRIMARY KEY (`uID`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `password` (`password`),
  CONSTRAINT `user_chk_1` CHECK (((length(`password`) > 7) and regexp_like(`password`,_utf8mb4'[0-9]') and regexp_like(`password`,_utf8mb4'[a-z]') and regexp_like(`password`,_utf8mb4'[A-Z]') and regexp_like(`password`,_utf8mb4'[^a-zA-Z0-9]')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-12 18:58:03
