-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: pokedex
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
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
  `aID` int NOT NULL AUTO_INCREMENT,
  `attack_name` varchar(50) NOT NULL,
  `type` varchar(10) NOT NULL,
  `category` varchar(20) DEFAULT NULL,
  `power` int DEFAULT NULL,
  `accuracy` int DEFAULT NULL,
  `PP` int DEFAULT NULL,
  `effect` varchar(100) NOT NULL,
  PRIMARY KEY (`aID`),
  CONSTRAINT `attacks_chk_1` CHECK (((`power` >= 0) and (`accuracy` >= 0) and (`PP` >= 0)))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attacks`
--

LOCK TABLES `attacks` WRITE;
/*!40000 ALTER TABLE `attacks` DISABLE KEYS */;
INSERT INTO `attacks` VALUES (1,'Thunderbolt','Electric','Special',90,100,15,'May paralyze the target.'),(2,'Vine Whip','Grass','Physical',45,100,25,'Hits the target with slender vines.'),(3,'Solar Beam','Grass','Special',120,100,10,'Charges on first turn, attacks on second.'),(4,'Psychic','Psychic','Special',90,100,10,'May lower Sp. Def of target.');
/*!40000 ALTER TABLE `attacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `currentattacks`
--

DROP TABLE IF EXISTS `currentattacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `currentattacks` (
  `instanceID` int NOT NULL,
  `aID` int NOT NULL,
  PRIMARY KEY (`instanceID`,`aID`),
  CONSTRAINT `currentattacks_ibfk_1` FOREIGN KEY (`instanceID`) REFERENCES `mypokemon` (`instanceID`)
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
  PRIMARY KEY (`pIDfrom`,`pIDinto`)
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
  PRIMARY KEY (`pID`,`aID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learnableattacks`
--

LOCK TABLES `learnableattacks` WRITE;
/*!40000 ALTER TABLE `learnableattacks` DISABLE KEYS */;
INSERT INTO `learnableattacks` VALUES (1,2),(1,3),(3,2),(3,3),(4,1),(6,4);
/*!40000 ALTER TABLE `learnableattacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `market`
--

DROP TABLE IF EXISTS `market`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `market` (
  `offered_pokemon_instance_id` int NOT NULL,
  `offering_user_id` int NOT NULL,
  `request_description` varchar(100) DEFAULT NULL,
  `reply_pokemon_instance_id` int NOT NULL,
  `reply_user_id` int NOT NULL,
  PRIMARY KEY (`offered_pokemon_instance_id`),
  KEY `reply_pokemon_instance_id` (`reply_pokemon_instance_id`),
  CONSTRAINT `market_ibfk_1` FOREIGN KEY (`offered_pokemon_instance_id`) REFERENCES `mypokemon` (`instanceID`),
  CONSTRAINT `market_ibfk_2` FOREIGN KEY (`reply_pokemon_instance_id`) REFERENCES `mypokemon` (`instanceID`)
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
  `instanceID` int NOT NULL AUTO_INCREMENT,
  `nickname` varchar(30) DEFAULT NULL,
  `level` int DEFAULT NULL,
  `favourite` bit(1) DEFAULT b'0',
  `onteam` bit(1) DEFAULT b'0',
  `showcase` bit(1) DEFAULT b'0',
  `dateAdded` datetime DEFAULT '2000-01-01 00:00:00',
  PRIMARY KEY (`instanceID`),
  CONSTRAINT `mypokemon_chk_1` CHECK ((`level` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mypokemon`
--

LOCK TABLES `mypokemon` WRITE;
/*!40000 ALTER TABLE `mypokemon` DISABLE KEYS */;
INSERT INTO `mypokemon` VALUES (6,4,1,'CloneGod',70,_binary '\0',_binary '',_binary '','2000-01-01 00:00:00'),(3,4,2,'Bulky',42,_binary '',_binary '',_binary '','2000-01-01 00:00:00'),(4,4,3,'Zaps',35,_binary '\0',_binary '',_binary '\0','2000-01-01 00:00:00'),(5,4,4,'Zoomer',55,_binary '\0',_binary '',_binary '','2000-01-01 00:00:00'),(1,4,5,'Leafy',14,_binary '\0',_binary '',_binary '\0','2000-01-01 00:00:00'),(2,4,6,'Evolver',25,_binary '\0',_binary '',_binary '','2000-01-01 00:00:00'),(1,4,7,'Seedling',9,_binary '\0',_binary '\0',_binary '','2000-01-01 00:00:00'),(3,4,8,'Tanky',40,_binary '\0',_binary '\0',_binary '','2000-01-01 00:00:00'),(4,5,9,'Sparkles',18,_binary '',_binary '\0',_binary '\0','2000-01-01 00:00:00'),(2,5,10,'IvyBoy',25,_binary '\0',_binary '',_binary '\0','2000-01-01 00:00:00'),(1,6,11,'Sprouter',15,_binary '\0',_binary '',_binary '\0','2000-01-01 00:00:00'),(2,6,12,'Bloomy',25,_binary '\0',_binary '\0',_binary '\0','2000-01-01 00:00:00'),(3,6,13,'VineBoss',45,_binary '\0',_binary '',_binary '','2000-01-01 00:00:00');
/*!40000 ALTER TABLE `mypokemon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `owns`
--

DROP TABLE IF EXISTS `owns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `owns` (
  `uID` int NOT NULL,
  `instanceId` int NOT NULL,
  `favourite` bit(1) DEFAULT NULL,
  `onteam` bit(1) DEFAULT NULL,
  `showcase` bit(1) DEFAULT NULL,
  `dateAdded` datetime DEFAULT NULL,
  PRIMARY KEY (`uID`,`instanceId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `owns`
--

LOCK TABLES `owns` WRITE;
/*!40000 ALTER TABLE `owns` DISABLE KEYS */;
/*!40000 ALTER TABLE `owns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pokedex`
--

DROP TABLE IF EXISTS `pokedex`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pokedex` (
  `pID` int NOT NULL AUTO_INCREMENT,
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
  CONSTRAINT `pokedex_chk_1` CHECK (((`HP` >= 0) and (`atk` >= 0) and (`def` >= 0) and (`spAtk` >= 0) and (`spDef` >= 0) and (`speed` >= 0)))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pokedex`
--

LOCK TABLES `pokedex` WRITE;
/*!40000 ALTER TABLE `pokedex` DISABLE KEYS */;
INSERT INTO `pokedex` VALUES (1,'Bulbasaur','Grass','Poison',45,49,49,65,65,45,_binary '\0','A strange seed was planted on its back at birth.'),(2,'Ivysaur','Grass','Poison',60,62,63,80,80,60,_binary '\0','The bulb on its back grows by drawing energy.'),(3,'Venusaur','Grass','Poison',80,82,83,100,100,80,_binary '\0','The plant blooms when it is absorbing solar energy.'),(4,'Pikachu','Electric',NULL,35,55,40,50,50,90,_binary '\0','It keeps its tail raised to monitor surroundings.'),(5,'Raichu','Electric',NULL,60,90,55,90,80,110,_binary '\0','Its tail discharges electricity into the ground.'),(6,'Mewtwo','Psychic',NULL,106,110,90,154,90,130,_binary '','It was created by a scientist after years of horrific gene splicing.');
/*!40000 ALTER TABLE `pokedex` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pokemon_instances`
--

DROP TABLE IF EXISTS `pokemon_instances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pokemon_instances` (
  `instanceID` int NOT NULL AUTO_INCREMENT,
  `pID` int NOT NULL,
  `nickname` varchar(30) DEFAULT NULL,
  `level` int DEFAULT NULL,
  PRIMARY KEY (`instanceID`),
  CONSTRAINT `pokemon_instances_chk_1` CHECK ((`level` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pokemon_instances`
--

LOCK TABLES `pokemon_instances` WRITE;
/*!40000 ALTER TABLE `pokemon_instances` DISABLE KEYS */;
/*!40000 ALTER TABLE `pokemon_instances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trades`
--

DROP TABLE IF EXISTS `trades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trades` (
  `trade_id` int NOT NULL AUTO_INCREMENT,
  `seller_pokemon_instance_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `buyer_id` int DEFAULT NULL,
  `buyer_pokemon_instance_id` int DEFAULT NULL,
  `status` varchar(15) NOT NULL,
  PRIMARY KEY (`trade_id`),
  KEY `seller_pokemon_instance_id` (`seller_pokemon_instance_id`),
  KEY `seller_id` (`seller_id`),
  KEY `buyer_pokemon_instance_id` (`buyer_pokemon_instance_id`),
  KEY `buyer_id` (`buyer_id`),
  CONSTRAINT `trades_ibfk_1` FOREIGN KEY (`seller_pokemon_instance_id`) REFERENCES `mypokemon` (`instanceID`),
  CONSTRAINT `trades_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `user` (`uID`),
  CONSTRAINT `trades_ibfk_3` FOREIGN KEY (`buyer_pokemon_instance_id`) REFERENCES `mypokemon` (`instanceID`),
  CONSTRAINT `trades_ibfk_4` FOREIGN KEY (`buyer_id`) REFERENCES `user` (`uID`)
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
  CONSTRAINT `typefx_chk_1` CHECK ((((`half_strength` + `double_strength`) + `no_impact`) = 1))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `typefx`
--

LOCK TABLES `typefx` WRITE;
/*!40000 ALTER TABLE `typefx` DISABLE KEYS */;
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
/*!40000 ALTER TABLE `types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `uID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `tradeCount` int NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` varchar(20) NOT NULL,
  PRIMARY KEY (`uID`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `password` (`password`),
  CONSTRAINT `user_chk_1` CHECK (((length(`password`) > 7) and regexp_like(`password`,_utf8mb4'[0-9]') and regexp_like(`password`,_utf8mb4'[a-z]') and regexp_like(`password`,_utf8mb4'[A-Z]') and regexp_like(`password`,_utf8mb4'[^a-zA-Z0-9]')))
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (4,'Cynthia',5,'championcyn','Garchomp142*'),(5,'Gary Oak',2,'rivalgary','Eeveelutions21*'),(6,'Erika',1,'flowerqueen','Bellsprout13*');
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

-- Dump completed on 2025-06-18 11:55:10
