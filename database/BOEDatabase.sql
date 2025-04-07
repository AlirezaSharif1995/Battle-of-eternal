CREATE DATABASE  IF NOT EXISTS `battle-of-eternals` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `battle-of-eternals`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: battle-of-eternals
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `buildinglevels`
--

DROP TABLE IF EXISTS `buildinglevels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buildinglevels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `building_id` int NOT NULL,
  `level` int NOT NULL,
  `cost` json DEFAULT NULL,
  `stats` json DEFAULT NULL,
  `build_time` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `building_id` (`building_id`),
  CONSTRAINT `buildinglevels_ibfk_1` FOREIGN KEY (`building_id`) REFERENCES `buildings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=518 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buildinglevels`
--

LOCK TABLES `buildinglevels` WRITE;
/*!40000 ALTER TABLE `buildinglevels` DISABLE KEYS */;
INSERT INTO `buildinglevels` VALUES (11,1,1,'{\"iron\": 0, \"wood\": 0, \"stone\": 0, \"wheat\": 0}','{\"civilization_points\": 5, \"build_time_reduction\": 0, \"population_consumers\": 3}',900),(12,1,2,'{\"iron\": 220, \"wood\": 270, \"stone\": 250, \"wheat\": 200}','{\"civilization_points\": 10, \"build_time_reduction\": 5, \"population_consumers\": 5}',1080),(13,1,3,'{\"iron\": 290, \"wood\": 400, \"stone\": 350, \"wheat\": 250}','{\"civilization_points\": 15, \"build_time_reduction\": 6, \"population_consumers\": 7}',1200),(14,1,4,'{\"iron\": 350, \"wood\": 500, \"stone\": 410, \"wheat\": 270}','{\"civilization_points\": 20, \"build_time_reduction\": 7, \"population_consumers\": 10}',1500),(15,1,5,'{\"iron\": 500, \"wood\": 700, \"stone\": 570, \"wheat\": 420}','{\"civilization_points\": 22, \"build_time_reduction\": 8, \"population_consumers\": 12}',1800),(16,1,6,'{\"iron\": 780, \"wood\": 950, \"stone\": 850, \"wheat\": 700}','{\"civilization_points\": 25, \"build_time_reduction\": 9, \"population_consumers\": 15}',2700),(17,1,7,'{\"iron\": 1100, \"wood\": 1500, \"stone\": 1200, \"wheat\": 1000}','{\"civilization_points\": 28, \"build_time_reduction\": 10, \"population_consumers\": 16}',3000),(18,1,8,'{\"iron\": 1200, \"wood\": 1600, \"stone\": 1300, \"wheat\": 1100}','{\"civilization_points\": 30, \"build_time_reduction\": 11, \"population_consumers\": 17}',4200),(19,1,9,'{\"iron\": 1300, \"wood\": 1800, \"stone\": 1400, \"wheat\": 1200}','{\"civilization_points\": 35, \"build_time_reduction\": 13, \"population_consumers\": 19}',5100),(20,1,10,'{\"iron\": 1700, \"wood\": 2100, \"stone\": 1800, \"wheat\": 1500}','{\"civilization_points\": 40, \"build_time_reduction\": 14, \"population_consumers\": 21}',6000),(21,1,11,'{\"iron\": 5200, \"wood\": 7500, \"stone\": 6500, \"wheat\": 4000}','{\"civilization_points\": 42, \"build_time_reduction\": 15, \"population_consumers\": 24}',6600),(22,1,12,'{\"iron\": 9000, \"wood\": 11000, \"stone\": 9500, \"wheat\": 8000}','{\"civilization_points\": 44, \"build_time_reduction\": 17, \"population_consumers\": 27}',7800),(23,1,13,'{\"iron\": 10500, \"wood\": 14500, \"stone\": 12000, \"wheat\": 10000}','{\"civilization_points\": 48, \"build_time_reduction\": 20, \"population_consumers\": 29}',8700),(24,1,14,'{\"iron\": 14000, \"wood\": 18000, \"stone\": 16000, \"wheat\": 12000}','{\"civilization_points\": 50, \"build_time_reduction\": 23, \"population_consumers\": 30}',11400),(25,1,15,'{\"iron\": 35000, \"wood\": 40000, \"stone\": 30000, \"wheat\": 25000}','{\"civilization_points\": 60, \"build_time_reduction\": 25, \"population_consumers\": 31}',13500),(26,1,16,'{\"iron\": 60000, \"wood\": 65000, \"stone\": 50000, \"wheat\": 35000}','{\"civilization_points\": 65, \"build_time_reduction\": 27, \"population_consumers\": 34}',16200),(27,1,17,'{\"iron\": 80000, \"wood\": 90000, \"stone\": 65000, \"wheat\": 55000}','{\"civilization_points\": 68, \"build_time_reduction\": 29, \"population_consumers\": 35}',19200),(28,1,18,'{\"iron\": 100000, \"wood\": 120000, \"stone\": 90000, \"wheat\": 70000}','{\"civilization_points\": 70, \"build_time_reduction\": 30, \"population_consumers\": 37}',39000),(29,1,19,'{\"iron\": 170000, \"wood\": 200000, \"stone\": 130000, \"wheat\": 100000}','{\"civilization_points\": 72, \"build_time_reduction\": 32, \"population_consumers\": 39}',60600),(30,1,20,'{\"iron\": 250000, \"wood\": 300000, \"stone\": 180000, \"wheat\": 130000}','{\"civilization_points\": 75, \"build_time_reduction\": 35, \"population_consumers\": 42}',129600),(31,1,21,'{\"iron\": 400000, \"wood\": 450000, \"stone\": 280000, \"wheat\": 160000}','{\"civilization_points\": 80, \"build_time_reduction\": 36, \"population_consumers\": 43}',180000),(32,1,22,'{\"iron\": 520000, \"wood\": 670000, \"stone\": 390000, \"wheat\": 280000}','{\"civilization_points\": 90, \"build_time_reduction\": 37, \"population_consumers\": 44}',244800),(33,1,23,'{\"iron\": 700000, \"wood\": 850000, \"stone\": 500000, \"wheat\": 400000}','{\"civilization_points\": 95, \"build_time_reduction\": 38, \"population_consumers\": 45}',262800),(34,1,24,'{\"iron\": 900000, \"wood\": 1000000, \"stone\": 650000, \"wheat\": 500000}','{\"civilization_points\": 100, \"build_time_reduction\": 39, \"population_consumers\": 47}',363600),(35,1,25,'{\"iron\": 1000000, \"wood\": 1200000, \"stone\": 800000, \"wheat\": 600000}','{\"civilization_points\": 110, \"build_time_reduction\": 40, \"population_consumers\": 50}',698400),(36,1,26,'{\"iron\": 1200000, \"wood\": 1400000, \"stone\": 970000, \"wheat\": 750000}','{\"civilization_points\": 140, \"build_time_reduction\": 41, \"population_consumers\": 53}',892800),(37,1,27,'{\"iron\": 1500000, \"wood\": 1800000, \"stone\": 1200000, \"wheat\": 930000}','{\"civilization_points\": 150, \"build_time_reduction\": 42, \"population_consumers\": 54}',1044000),(38,1,28,'{\"iron\": 2000000, \"wood\": 2200000, \"stone\": 1500000, \"wheat\": 1200000}','{\"civilization_points\": 155, \"build_time_reduction\": 43, \"population_consumers\": 58}',1090800),(39,1,29,'{\"iron\": 2500000, \"wood\": 3000000, \"stone\": 1900000, \"wheat\": 1500000}','{\"civilization_points\": 160, \"build_time_reduction\": 45, \"population_consumers\": 62}',1141200),(40,1,30,'{\"iron\": 3000000, \"wood\": 4000000, \"stone\": 2300000, \"wheat\": 1800000}','{\"civilization_points\": 190, \"build_time_reduction\": 50, \"population_consumers\": 66}',1728000),(41,2,1,'{\"iron\": 0, \"wood\": 0, \"stone\": 0, \"wheat\": 0}','{\"wheat_production\": 60, \"civilization_points\": 5, \"population_consumers\": 0}',0),(42,2,2,'{\"iron\": 150, \"wood\": 80, \"stone\": 250, \"wheat\": 220}','{\"wheat_production\": 180, \"civilization_points\": 10, \"population_consumers\": 0}',600),(43,2,3,'{\"iron\": 240, \"wood\": 150, \"stone\": 350, \"wheat\": 290}','{\"wheat_production\": 300, \"civilization_points\": 15, \"population_consumers\": 0}',900),(44,2,4,'{\"iron\": 300, \"wood\": 270, \"stone\": 500, \"wheat\": 450}','{\"wheat_production\": 600, \"civilization_points\": 20, \"population_consumers\": 3}',1200),(45,2,5,'{\"iron\": 350, \"wood\": 310, \"stone\": 620, \"wheat\": 550}','{\"wheat_production\": 780, \"civilization_points\": 22, \"population_consumers\": 6}',1380),(46,2,6,'{\"iron\": 460, \"wood\": 400, \"stone\": 850, \"wheat\": 780}','{\"wheat_production\": 1080, \"civilization_points\": 25, \"population_consumers\": 8}',1800),(47,2,7,'{\"iron\": 2000, \"wood\": 1000, \"stone\": 2800, \"wheat\": 2400}','{\"wheat_production\": 1260, \"civilization_points\": 28, \"population_consumers\": 10}',7200),(48,2,8,'{\"iron\": 3500, \"wood\": 1300, \"stone\": 4500, \"wheat\": 4000}','{\"wheat_production\": 1560, \"civilization_points\": 30, \"population_consumers\": 12}',12300),(49,2,9,'{\"iron\": 6000, \"wood\": 2000, \"stone\": 8000, \"wheat\": 7000}','{\"wheat_production\": 2400, \"civilization_points\": 35, \"population_consumers\": 15}',20400),(50,2,10,'{\"iron\": 13000, \"wood\": 4000, \"stone\": 17000, \"wheat\": 15000}','{\"wheat_production\": 4800, \"civilization_points\": 40, \"population_consumers\": 18}',28200),(51,2,11,'{\"iron\": 16000, \"wood\": 6000, \"stone\": 22000, \"wheat\": 18000}','{\"wheat_production\": 7080, \"civilization_points\": 45, \"population_consumers\": 20}',34200),(52,2,12,'{\"iron\": 18000, \"wood\": 7000, \"stone\": 25000, \"wheat\": 20000}','{\"wheat_production\": 11160, \"civilization_points\": 50, \"population_consumers\": 20}',37800),(53,2,13,'{\"iron\": 20000, \"wood\": 8000, \"stone\": 30000, \"wheat\": 24000}','{\"wheat_production\": 19500, \"civilization_points\": 55, \"population_consumers\": 23}',40800),(54,2,14,'{\"iron\": 24000, \"wood\": 9000, \"stone\": 35000, \"wheat\": 28000}','{\"wheat_production\": 26580, \"civilization_points\": 60, \"population_consumers\": 26}',43800),(55,2,15,'{\"iron\": 28000, \"wood\": 10000, \"stone\": 40000, \"wheat\": 32000}','{\"wheat_production\": 31380, \"civilization_points\": 65, \"population_consumers\": 27}',46800),(56,2,16,'{\"iron\": 32000, \"wood\": 11000, \"stone\": 45000, \"wheat\": 36000}','{\"wheat_production\": 38580, \"civilization_points\": 70, \"population_consumers\": 29}',50400),(57,2,17,'{\"iron\": 36000, \"wood\": 12000, \"stone\": 50000, \"wheat\": 40000}','{\"wheat_production\": 45660, \"civilization_points\": 75, \"population_consumers\": 31}',54000),(58,2,18,'{\"iron\": 40000, \"wood\": 13000, \"stone\": 55000, \"wheat\": 44000}','{\"wheat_production\": 56820, \"civilization_points\": 80, \"population_consumers\": 34}',57600),(59,2,19,'{\"iron\": 44000, \"wood\": 14000, \"stone\": 60000, \"wheat\": 48000}','{\"wheat_production\": 70380, \"civilization_points\": 85, \"population_consumers\": 35}',61200),(60,2,20,'{\"iron\": 48000, \"wood\": 15000, \"stone\": 65000, \"wheat\": 52000}','{\"wheat_production\": 89880, \"civilization_points\": 90, \"population_consumers\": 37}',64800),(61,2,21,'{\"iron\": 52000, \"wood\": 16000, \"stone\": 70000, \"wheat\": 56000}','{\"wheat_production\": 121260, \"civilization_points\": 95, \"population_consumers\": 40}',68400),(62,2,22,'{\"iron\": 56000, \"wood\": 17000, \"stone\": 75000, \"wheat\": 60000}','{\"wheat_production\": 166920, \"civilization_points\": 100, \"population_consumers\": 42}',72000),(63,2,23,'{\"iron\": 60000, \"wood\": 18000, \"stone\": 80000, \"wheat\": 64000}','{\"wheat_production\": 213000, \"civilization_points\": 105, \"population_consumers\": 45}',75600),(64,2,24,'{\"iron\": 64000, \"wood\": 19000, \"stone\": 85000, \"wheat\": 68000}','{\"wheat_production\": 239700, \"civilization_points\": 110, \"population_consumers\": 47}',79200),(65,2,25,'{\"iron\": 68000, \"wood\": 20000, \"stone\": 90000, \"wheat\": 72000}','{\"wheat_production\": 304860, \"civilization_points\": 115, \"population_consumers\": 50}',82800),(66,2,26,'{\"iron\": 72000, \"wood\": 21000, \"stone\": 95000, \"wheat\": 76000}','{\"wheat_production\": 424980, \"civilization_points\": 120, \"population_consumers\": 53}',86400),(67,2,27,'{\"iron\": 76000, \"wood\": 22000, \"stone\": 100000, \"wheat\": 80000}','{\"wheat_production\": 534600, \"civilization_points\": 125, \"population_consumers\": 56}',90000),(68,2,28,'{\"iron\": 80000, \"wood\": 23000, \"stone\": 105000, \"wheat\": 84000}','{\"wheat_production\": 693600, \"civilization_points\": 130, \"population_consumers\": 60}',93600),(69,2,29,'{\"iron\": 84000, \"wood\": 24000, \"stone\": 110000, \"wheat\": 88000}','{\"wheat_production\": 783480, \"civilization_points\": 135, \"population_consumers\": 64}',97200),(70,2,30,'{\"iron\": 88000, \"wood\": 25000, \"stone\": 115000, \"wheat\": 92000}','{\"wheat_production\": 951000, \"civilization_points\": 140, \"population_consumers\": 68}',100800),(81,3,1,'{\"iron\": 0, \"wood\": 0, \"stone\": 0, \"wheat\": 0}','{\"stone_production\": 60, \"civilization_points\": 5, \"population_consumers\": 3}',0),(82,3,2,'{\"iron\": 220, \"wood\": 250, \"stone\": 60, \"wheat\": 150}','{\"stone_production\": 180, \"civilization_points\": 10, \"population_consumers\": 6}',600),(83,3,3,'{\"iron\": 280, \"wood\": 340, \"stone\": 90, \"wheat\": 190}','{\"stone_production\": 300, \"civilization_points\": 15, \"population_consumers\": 8}',1200),(84,3,4,'{\"iron\": 350, \"wood\": 450, \"stone\": 110, \"wheat\": 250}','{\"stone_production\": 600, \"civilization_points\": 20, \"population_consumers\": 10}',1380),(85,3,5,'{\"iron\": 420, \"wood\": 550, \"stone\": 130, \"wheat\": 300}','{\"stone_production\": 780, \"civilization_points\": 22, \"population_consumers\": 12}',1800),(86,3,6,'{\"iron\": 900, \"wood\": 1000, \"stone\": 300, \"wheat\": 800}','{\"stone_production\": 1080, \"civilization_points\": 25, \"population_consumers\": 15}',2400),(87,3,7,'{\"iron\": 3500, \"wood\": 4500, \"stone\": 1000, \"wheat\": 3000}','{\"stone_production\": 1260, \"civilization_points\": 28, \"population_consumers\": 16}',10800),(88,3,8,'{\"iron\": 5000, \"wood\": 6000, \"stone\": 1600, \"wheat\": 4500}','{\"stone_production\": 1560, \"civilization_points\": 30, \"population_consumers\": 18}',18000),(89,3,9,'{\"iron\": 7500, \"wood\": 9000, \"stone\": 2500, \"wheat\": 6000}','{\"stone_production\": 2400, \"civilization_points\": 35, \"population_consumers\": 20}',27000),(90,3,10,'{\"iron\": 15000, \"wood\": 17000, \"stone\": 4500, \"wheat\": 12000}','{\"stone_production\": 3000, \"civilization_points\": 40, \"population_consumers\": 22}',34200),(91,3,11,'{\"iron\": 20000, \"wood\": 24000, \"stone\": 7000, \"wheat\": 17000}','{\"stone_production\": 4080, \"civilization_points\": 42, \"population_consumers\": 24}',40800),(92,3,12,'{\"iron\": 40000, \"wood\": 55000, \"stone\": 15000, \"wheat\": 35000}','{\"stone_production\": 7260, \"civilization_points\": 44, \"population_consumers\": 27}',73500),(93,3,13,'{\"iron\": 70000, \"wood\": 75000, \"stone\": 25000, \"wheat\": 55000}','{\"stone_production\": 9000, \"civilization_points\": 48, \"population_consumers\": 30}',88500),(94,3,14,'{\"iron\": 100000, \"wood\": 120000, \"stone\": 40000, \"wheat\": 90000}','{\"stone_production\": 10200, \"civilization_points\": 50, \"population_consumers\": 33}',103500),(95,3,15,'{\"iron\": 200000, \"wood\": 240000, \"stone\": 70000, \"wheat\": 140000}','{\"stone_production\": 11460, \"civilization_points\": 55, \"population_consumers\": 35}',123000),(96,3,16,'{\"iron\": 370000, \"wood\": 400000, \"stone\": 150000, \"wheat\": 300000}','{\"stone_production\": 12720, \"civilization_points\": 60, \"population_consumers\": 36}',194000),(97,3,17,'{\"iron\": 490000, \"wood\": 550000, \"stone\": 200000, \"wheat\": 380000}','{\"stone_production\": 13980, \"civilization_points\": 65, \"population_consumers\": 38}',234000),(98,3,18,'{\"iron\": 700000, \"wood\": 750000, \"stone\": 300000, \"wheat\": 500000}','{\"stone_production\": 15300, \"civilization_points\": 70, \"population_consumers\": 40}',270000),(99,3,19,'{\"iron\": 900000, \"wood\": 1000000, \"stone\": 400000, \"wheat\": 650000}','{\"stone_production\": 17580, \"civilization_points\": 75, \"population_consumers\": 41}',324000),(100,3,20,'{\"iron\": 1000000, \"wood\": 1200000, \"stone\": 550000, \"wheat\": 800000}','{\"stone_production\": 20640, \"civilization_points\": 80, \"population_consumers\": 44}',432000),(101,3,21,'{\"iron\": 1200000, \"wood\": 1400000, \"stone\": 650000, \"wheat\": 980000}','{\"stone_production\": 17580, \"civilization_points\": 80, \"population_consumers\": 47}',1080000),(102,3,22,'{\"iron\": 1400000, \"wood\": 1600000, \"stone\": 900000, \"wheat\": 1100000}','{\"stone_production\": 20640, \"civilization_points\": 90, \"population_consumers\": 50}',1728000),(103,3,23,'{\"iron\": 1600000, \"wood\": 1800000, \"stone\": 1000000, \"wheat\": 1300000}','{\"stone_production\": 24700, \"civilization_points\": 95, \"population_consumers\": 53}',2880000),(104,3,24,'{\"iron\": 1900000, \"wood\": 2100000, \"stone\": 1100000, \"wheat\": 1600000}','{\"stone_production\": 25780, \"civilization_points\": 100, \"population_consumers\": 56}',3080000),(105,3,25,'{\"iron\": 2200000, \"wood\": 2400000, \"stone\": 1300000, \"wheat\": 1900000}','{\"stone_production\": 28900, \"civilization_points\": 110, \"population_consumers\": 59}',3870000),(106,3,26,'{\"iron\": 2500000, \"wood\": 2700000, \"stone\": 1500000, \"wheat\": 2200000}','{\"stone_production\": 32000, \"civilization_points\": 120, \"population_consumers\": 62}',4200000),(107,3,27,'{\"iron\": 2800000, \"wood\": 3000000, \"stone\": 1700000, \"wheat\": 2500000}','{\"stone_production\": 35000, \"civilization_points\": 130, \"population_consumers\": 65}',4600000),(108,3,28,'{\"iron\": 3200000, \"wood\": 3400000, \"stone\": 1900000, \"wheat\": 2800000}','{\"stone_production\": 38000, \"civilization_points\": 140, \"population_consumers\": 68}',5000000),(109,3,29,'{\"iron\": 3600000, \"wood\": 3800000, \"stone\": 2200000, \"wheat\": 3200000}','{\"stone_production\": 41000, \"civilization_points\": 150, \"population_consumers\": 71}',5400000),(110,3,30,'{\"iron\": 4000000, \"wood\": 4200000, \"stone\": 2500000, \"wheat\": 3600000}','{\"stone_production\": 44000, \"civilization_points\": 160, \"population_consumers\": 74}',5800000),(130,4,1,'{\"iron\": 0, \"wood\": 0, \"stone\": 0, \"wheat\": 0}','{\"wood_production\": 60, \"civilization_points\": 0, \"population_consumers\": 0}',0),(131,4,2,'{\"iron\": 200, \"wood\": 50, \"stone\": 140, \"wheat\": 150}','{\"wood_production\": 60, \"civilization_points\": 5, \"population_consumers\": 3}',600),(132,4,3,'{\"iron\": 280, \"wood\": 90, \"stone\": 200, \"wheat\": 220}','{\"wood_production\": 180, \"civilization_points\": 10, \"population_consumers\": 6}',900),(133,4,4,'{\"iron\": 350, \"wood\": 120, \"stone\": 250, \"wheat\": 280}','{\"wood_production\": 300, \"civilization_points\": 15, \"population_consumers\": 9}',1200),(134,4,5,'{\"iron\": 590, \"wood\": 200, \"stone\": 350, \"wheat\": 500}','{\"wood_production\": 600, \"civilization_points\": 20, \"population_consumers\": 12}',1800),(135,4,6,'{\"iron\": 1000, \"wood\": 500, \"stone\": 800, \"wheat\": 900}','{\"wood_production\": 780, \"civilization_points\": 25, \"population_consumers\": 15}',2400),(136,4,7,'{\"iron\": 4000, \"wood\": 1000, \"stone\": 2500, \"wheat\": 3000}','{\"wood_production\": 1080, \"civilization_points\": 28, \"population_consumers\": 18}',7800),(137,4,8,'{\"iron\": 7000, \"wood\": 1800, \"stone\": 4000, \"wheat\": 4500}','{\"wood_production\": 1260, \"civilization_points\": 30, \"population_consumers\": 21}',15000),(138,4,9,'{\"iron\": 7500, \"wood\": 2500, \"stone\": 5000, \"wheat\": 6000}','{\"wood_production\": 1560, \"civilization_points\": 35, \"population_consumers\": 24}',24000),(139,4,10,'{\"iron\": 17000, \"wood\": 4500, \"stone\": 12000, \"wheat\": 15000}','{\"wood_production\": 2400, \"civilization_points\": 40, \"population_consumers\": 27}',47000),(140,4,11,'{\"iron\": 24000, \"wood\": 7000, \"stone\": 17000, \"wheat\": 20000}','{\"wood_production\": 3000, \"civilization_points\": 42, \"population_consumers\": 30}',72000),(141,4,12,'{\"iron\": 55000, \"wood\": 15000, \"stone\": 35000, \"wheat\": 40000}','{\"wood_production\": 4080, \"civilization_points\": 48, \"population_consumers\": 33}',148500),(142,4,13,'{\"iron\": 75000, \"wood\": 25000, \"stone\": 55000, \"wheat\": 70000}','{\"wood_production\": 6000, \"civilization_points\": 55, \"population_consumers\": 36}',315000),(143,4,14,'{\"iron\": 120000, \"wood\": 40000, \"stone\": 90000, \"wheat\": 100000}','{\"wood_production\": 7260, \"civilization_points\": 60, \"population_consumers\": 39}',604800),(144,4,15,'{\"iron\": 240000, \"wood\": 70000, \"stone\": 140000, \"wheat\": 200000}','{\"wood_production\": 9000, \"civilization_points\": 70, \"population_consumers\": 42}',1036800),(145,4,16,'{\"iron\": 400000, \"wood\": 150000, \"stone\": 300000, \"wheat\": 370000}','{\"wood_production\": 10200, \"civilization_points\": 80, \"population_consumers\": 45}',10368000),(146,4,17,'{\"iron\": 550000, \"wood\": 200000, \"stone\": 350000, \"wheat\": 490000}','{\"wood_production\": 11460, \"civilization_points\": 90, \"population_consumers\": 48}',11520000),(147,4,18,'{\"iron\": 750000, \"wood\": 300000, \"stone\": 500000, \"wheat\": 700000}','{\"wood_production\": 12720, \"civilization_points\": 95, \"population_consumers\": 51}',13056000),(148,4,19,'{\"iron\": 1000000, \"wood\": 400000, \"stone\": 650000, \"wheat\": 900000}','{\"wood_production\": 13980, \"civilization_points\": 100, \"population_consumers\": 54}',17280000),(149,4,20,'{\"iron\": 1200000, \"wood\": 550000, \"stone\": 900000, \"wheat\": 1000000}','{\"stone_production\": 15300, \"civilization_points\": 110, \"population_consumers\": 57}',21600000),(150,4,21,'{\"iron\": 1200000, \"wood\": 1400000, \"stone\": 650000, \"wheat\": 980000}','{\"wood_production\": 17580, \"civilization_points\": 80, \"population_consumers\": 60}',6480000),(151,4,22,'{\"iron\": 1400000, \"wood\": 1600000, \"stone\": 900000, \"wheat\": 1100000}','{\"wood_production\": 20640, \"civilization_points\": 90, \"population_consumers\": 63}',10368000),(152,4,23,'{\"iron\": 1600000, \"wood\": 1800000, \"stone\": 1000000, \"wheat\": 1300000}','{\"wood_production\": 24700, \"civilization_points\": 95, \"population_consumers\": 66}',17280000),(153,4,24,'{\"iron\": 1900000, \"wood\": 2100000, \"stone\": 1100000, \"wheat\": 1600000}','{\"wood_production\": 25780, \"civilization_points\": 100, \"population_consumers\": 69}',18528000),(154,4,25,'{\"iron\": 2200000, \"wood\": 2400000, \"stone\": 1300000, \"wheat\": 1900000}','{\"wood_production\": 30000, \"civilization_points\": 110, \"population_consumers\": 72}',21600000),(155,4,26,'{\"iron\": 2500000, \"wood\": 2600000, \"stone\": 1500000, \"wheat\": 2100000}','{\"wood_production\": 33000, \"civilization_points\": 120, \"population_consumers\": 75}',24576000),(156,4,27,'{\"iron\": 2700000, \"wood\": 2800000, \"stone\": 1700000, \"wheat\": 2300000}','{\"wood_production\": 36000, \"civilization_points\": 130, \"population_consumers\": 78}',27648000),(157,4,28,'{\"iron\": 2900000, \"wood\": 3000000, \"stone\": 1900000, \"wheat\": 2500000}','{\"wood_production\": 39000, \"civilization_points\": 140, \"population_consumers\": 81}',30240000),(158,4,29,'{\"iron\": 3100000, \"wood\": 3200000, \"stone\": 2100000, \"wheat\": 2700000}','{\"wood_production\": 42000, \"civilization_points\": 150, \"population_consumers\": 84}',33096000),(159,4,30,'{\"iron\": 3400000, \"wood\": 3400000, \"stone\": 2300000, \"wheat\": 3000000}','{\"wood_production\": 45000, \"civilization_points\": 160, \"population_consumers\": 87}',36000000),(160,5,1,'{\"iron\": 0, \"wood\": 0, \"stone\": 0, \"wheat\": 0}','{\"iron_production\": 60, \"civilization_points\": 5, \"population_consumers\": 0}',0),(161,5,2,'{\"iron\": 50, \"wood\": 150, \"stone\": 140, \"wheat\": 100}','{\"iron_production\": 180, \"civilization_points\": 10, \"population_consumers\": 0}',600),(162,5,3,'{\"iron\": 80, \"wood\": 220, \"stone\": 200, \"wheat\": 120}','{\"iron_production\": 300, \"civilization_points\": 15, \"population_consumers\": 0}',900),(163,5,4,'{\"iron\": 110, \"wood\": 320, \"stone\": 310, \"wheat\": 150}','{\"iron_production\": 600, \"civilization_points\": 20, \"population_consumers\": 1}',1380),(164,5,5,'{\"iron\": 190, \"wood\": 680, \"stone\": 650, \"wheat\": 300}','{\"iron_production\": 780, \"civilization_points\": 22, \"population_consumers\": 2}',1800),(165,5,6,'{\"iron\": 300, \"wood\": 1000, \"stone\": 1000, \"wheat\": 800}','{\"iron_production\": 1080, \"civilization_points\": 25, \"population_consumers\": 3}',5400),(166,5,7,'{\"iron\": 1000, \"wood\": 4000, \"stone\": 3500, \"wheat\": 2500}','{\"iron_production\": 1260, \"civilization_points\": 28, \"population_consumers\": 4}',7800),(167,5,8,'{\"iron\": 2000, \"wood\": 8000, \"stone\": 8000, \"wheat\": 6000}','{\"iron_production\": 1560, \"civilization_points\": 30, \"population_consumers\": 5}',12600),(168,5,9,'{\"iron\": 3500, \"wood\": 9500, \"stone\": 9000, \"wheat\": 8000}','{\"iron_production\": 1860, \"civilization_points\": 35, \"population_consumers\": 7}',18000),(169,5,10,'{\"iron\": 5500, \"wood\": 17000, \"stone\": 15000, \"wheat\": 12000}','{\"iron_production\": 2400, \"civilization_points\": 40, \"population_consumers\": 9}',21000),(170,5,11,'{\"iron\": 7000, \"wood\": 24000, \"stone\": 20000, \"wheat\": 17000}','{\"iron_production\": 3000, \"civilization_points\": 42, \"population_consumers\": 12}',27300),(171,5,12,'{\"iron\": 15000, \"wood\": 55000, \"stone\": 40000, \"wheat\": 35000}','{\"iron_production\": 4080, \"civilization_points\": 50, \"population_consumers\": 15}',49000),(172,5,13,'{\"iron\": 25000, \"wood\": 75000, \"stone\": 70000, \"wheat\": 55000}','{\"iron_production\": 7260, \"civilization_points\": 60, \"population_consumers\": 18}',55000),(173,5,14,'{\"iron\": 40000, \"wood\": 120000, \"stone\": 100000, \"wheat\": 90000}','{\"iron_production\": 9000, \"civilization_points\": 70, \"population_consumers\": 21}',72000),(174,5,15,'{\"iron\": 70000, \"wood\": 240000, \"stone\": 200000, \"wheat\": 140000}','{\"iron_production\": 10200, \"civilization_points\": 80, \"population_consumers\": 24}',90000),(175,5,16,'{\"iron\": 150000, \"wood\": 400000, \"stone\": 370000, \"wheat\": 300000}','{\"iron_production\": 11460, \"civilization_points\": 90, \"population_consumers\": 27}',108000),(176,5,17,'{\"iron\": 200000, \"wood\": 550000, \"stone\": 490000, \"wheat\": 400000}','{\"iron_production\": 12720, \"civilization_points\": 100, \"population_consumers\": 30}',126000),(177,5,18,'{\"iron\": 300000, \"wood\": 750000, \"stone\": 700000, \"wheat\": 500000}','{\"iron_production\": 13980, \"civilization_points\": 110, \"population_consumers\": 33}',144000),(178,5,19,'{\"iron\": 400000, \"wood\": 1000000, \"stone\": 900000, \"wheat\": 650000}','{\"iron_production\": 15300, \"civilization_points\": 120, \"population_consumers\": 36}',162000),(179,5,20,'{\"iron\": 500000, \"wood\": 1200000, \"stone\": 1000000, \"wheat\": 900000}','{\"iron_production\": 17580, \"civilization_points\": 130, \"population_consumers\": 39}',180000),(180,5,21,'{\"iron\": 650000, \"wood\": 1400000, \"stone\": 1200000, \"wheat\": 1100000}','{\"iron_production\": 17580, \"civilization_points\": 130, \"population_consumers\": 42}',720000),(181,5,22,'{\"iron\": 850000, \"wood\": 1600000, \"stone\": 1300000, \"wheat\": 1400000}','{\"iron_production\": 20640, \"civilization_points\": 140, \"population_consumers\": 45}',864000),(182,5,23,'{\"iron\": 1000000, \"wood\": 1800000, \"stone\": 1400000, \"wheat\": 1600000}','{\"iron_production\": 24700, \"civilization_points\": 150, \"population_consumers\": 47}',864000),(183,5,24,'{\"iron\": 1200000, \"wood\": 2100000, \"stone\": 1600000, \"wheat\": 1900000}','{\"iron_production\": 25780, \"civilization_points\": 160, \"population_consumers\": 50}',1000000),(184,5,25,'{\"iron\": 1500000, \"wood\": 2500000, \"stone\": 1900000, \"wheat\": 2200000}','{\"iron_production\": 27900, \"civilization_points\": 170, \"population_consumers\": 52}',1200000),(185,5,26,'{\"iron\": 1800000, \"wood\": 2700000, \"stone\": 2100000, \"wheat\": 2500000}','{\"iron_production\": 30100, \"civilization_points\": 180, \"population_consumers\": 52}',1440000),(186,5,27,'{\"iron\": 2200000, \"wood\": 3000000, \"stone\": 2400000, \"wheat\": 2900000}','{\"iron_production\": 32400, \"civilization_points\": 190, \"population_consumers\": 54}',1600000),(187,5,28,'{\"iron\": 2500000, \"wood\": 3500000, \"stone\": 2600000, \"wheat\": 3200000}','{\"iron_production\": 34800, \"civilization_points\": 200, \"population_consumers\": 56}',1800000),(188,5,29,'{\"iron\": 2700000, \"wood\": 3700000, \"stone\": 2800000, \"wheat\": 3500000}','{\"iron_production\": 37300, \"civilization_points\": 210, \"population_consumers\": 58}',2000000),(189,5,30,'{\"iron\": 3000000, \"wood\": 4000000, \"stone\": 3000000, \"wheat\": 4000000}','{\"iron_production\": 40000, \"civilization_points\": 220, \"population_consumers\": 61}',2400000),(190,6,1,'{\"iron\": 150000, \"wood\": 150000, \"stone\": 150000, \"wheat\": 150000}','{\"defense_power\": 10000, \"elixir_production\": 60, \"civilization_points\": 5, \"population_consumers\": 4}',28800),(191,6,2,'{\"iron\": 200000, \"wood\": 200000, \"stone\": 200000, \"wheat\": 200000}','{\"defense_power\": 20000, \"elixir_production\": 120, \"civilization_points\": 10, \"population_consumers\": 6}',36000),(192,6,3,'{\"iron\": 300000, \"wood\": 300000, \"stone\": 300000, \"wheat\": 300000}','{\"defense_power\": 35000, \"elixir_production\": 240, \"civilization_points\": 15, \"population_consumers\": 9}',43200),(193,6,4,'{\"iron\": 400000, \"wood\": 400000, \"stone\": 400000, \"wheat\": 400000}','{\"defense_power\": 50000, \"elixir_production\": 300, \"civilization_points\": 20, \"population_consumers\": 12}',61200),(194,6,5,'{\"iron\": 500000, \"wood\": 500000, \"stone\": 500000, \"wheat\": 500000}','{\"defense_power\": 70000, \"elixir_production\": 420, \"civilization_points\": 22, \"population_consumers\": 16}',79200),(195,6,6,'{\"iron\": 550000, \"wood\": 550000, \"stone\": 550000, \"wheat\": 550000}','{\"defense_power\": 90000, \"elixir_production\": 540, \"civilization_points\": 25, \"population_consumers\": 19}',105000),(196,6,7,'{\"iron\": 700000, \"wood\": 700000, \"stone\": 700000, \"wheat\": 700000}','{\"defense_power\": 110000, \"elixir_production\": 660, \"civilization_points\": 28, \"population_consumers\": 21}',144000),(197,6,8,'{\"iron\": 850000, \"wood\": 850000, \"stone\": 850000, \"wheat\": 850000}','{\"defense_power\": 140000, \"elixir_production\": 720, \"civilization_points\": 30, \"population_consumers\": 24}',259200),(198,6,9,'{\"iron\": 1200000, \"wood\": 1200000, \"stone\": 1200000, \"wheat\": 1200000}','{\"defense_power\": 170000, \"elixir_production\": 780, \"civilization_points\": 35, \"population_consumers\": 27}',432000),(199,6,10,'{\"iron\": 1600000, \"wood\": 1600000, \"stone\": 1600000, \"wheat\": 1600000}','{\"defense_power\": 200000, \"elixir_production\": 900, \"civilization_points\": 40, \"population_consumers\": 29}',432000),(200,6,11,'{\"iron\": 2200000, \"wood\": 2200000, \"stone\": 2200000, \"wheat\": 2200000}','{\"defense_power\": 230000, \"elixir_production\": 960, \"civilization_points\": 42, \"population_consumers\": 33}',693600),(201,6,12,'{\"iron\": 2500000, \"wood\": 2500000, \"stone\": 2500000, \"wheat\": 2500000}','{\"defense_power\": 260000, \"elixir_production\": 1020, \"civilization_points\": 44, \"population_consumers\": 37}',864000),(202,6,13,'{\"iron\": 2800000, \"wood\": 2800000, \"stone\": 2800000, \"wheat\": 2800000}','{\"defense_power\": 300000, \"elixir_production\": 1200, \"civilization_points\": 48, \"population_consumers\": 40}',1036800),(203,6,14,'{\"iron\": 4000000, \"wood\": 4000000, \"stone\": 4000000, \"wheat\": 4000000}','{\"defense_power\": 340000, \"elixir_production\": 1260, \"civilization_points\": 50, \"population_consumers\": 44}',1036800),(204,6,15,'{\"iron\": 5000000, \"wood\": 5000000, \"stone\": 5000000, \"wheat\": 5000000}','{\"defense_power\": 400000, \"elixir_production\": 1320, \"civilization_points\": 60, \"population_consumers\": 48}',1296000),(205,7,1,'{\"iron\": 250, \"wood\": 250, \"stone\": 150, \"wheat\": 50}','{\"defense_power\": 5000, \"storage_capacity\": 2500, \"civilization_points\": 5, \"population_consumers\": 3}',28800),(206,7,2,'{\"iron\": 800, \"wood\": 800, \"stone\": 600, \"wheat\": 400}','{\"defense_power\": 12000, \"storage_capacity\": 3500, \"civilization_points\": 10, \"population_consumers\": 6}',36000),(207,7,3,'{\"iron\": 1200, \"wood\": 1200, \"stone\": 1000, \"wheat\": 900}','{\"defense_power\": 19000, \"storage_capacity\": 8000, \"civilization_points\": 15, \"population_consumers\": 8}',43200),(208,7,4,'{\"iron\": 1500, \"wood\": 1500, \"stone\": 1200, \"wheat\": 1000}','{\"defense_power\": 26000, \"storage_capacity\": 15000, \"civilization_points\": 20, \"population_consumers\": 10}',61200),(209,7,5,'{\"iron\": 2000, \"wood\": 2000, \"stone\": 1200, \"wheat\": 1200}','{\"defense_power\": 34000, \"storage_capacity\": 20000, \"civilization_points\": 22, \"population_consumers\": 13}',79200),(210,7,6,'{\"iron\": 3500, \"wood\": 3500, \"stone\": 2000, \"wheat\": 2000}','{\"defense_power\": 42000, \"storage_capacity\": 25000, \"civilization_points\": 25, \"population_consumers\": 14}',90000),(211,7,7,'{\"iron\": 6000, \"wood\": 6000, \"stone\": 4000, \"wheat\": 3000}','{\"defense_power\": 50000, \"storage_capacity\": 35000, \"civilization_points\": 28, \"population_consumers\": 16}',103680),(212,7,8,'{\"iron\": 9000, \"wood\": 9000, \"stone\": 6000, \"wheat\": 5000}','{\"defense_power\": 62000, \"storage_capacity\": 50000, \"civilization_points\": 30, \"population_consumers\": 20}',129600),(213,7,9,'{\"iron\": 1200000, \"wood\": 1200000, \"stone\": 1200000, \"wheat\": 1200000}','{\"defense_power\": 74000, \"storage_capacity\": 70000, \"civilization_points\": 35, \"population_consumers\": 22}',144000),(214,7,10,'{\"iron\": 12000, \"wood\": 12000, \"stone\": 9000, \"wheat\": 8000}','{\"defense_power\": 86000, \"storage_capacity\": 100000, \"civilization_points\": 40, \"population_consumers\": 25}',172800),(215,7,11,'{\"iron\": 15000, \"wood\": 15000, \"stone\": 11000, \"wheat\": 10000}','{\"defense_power\": 98000, \"storage_capacity\": 150000, \"civilization_points\": 42, \"population_consumers\": 28}',207360),(216,7,12,'{\"iron\": 24000, \"wood\": 24000, \"stone\": 20000, \"wheat\": 17000}','{\"defense_power\": 110000, \"storage_capacity\": 175000, \"civilization_points\": 44, \"population_consumers\": 30}',216000),(217,7,13,'{\"iron\": 35000, \"wood\": 35000, \"stone\": 25000, \"wheat\": 23000}','{\"defense_power\": 125000, \"storage_capacity\": 250000, \"civilization_points\": 48, \"population_consumers\": 31}',259200),(218,7,14,'{\"iron\": 65000, \"wood\": 65000, \"stone\": 40000, \"wheat\": 35000}','{\"defense_power\": 140000, \"storage_capacity\": 300000, \"civilization_points\": 50, \"population_consumers\": 35}',691200),(219,7,15,'{\"iron\": 80000, \"wood\": 80000, \"stone\": 55000, \"wheat\": 50000}','{\"defense_power\": 160000, \"storage_capacity\": 400000, \"civilization_points\": 60, \"population_consumers\": 38}',1036800),(220,7,16,'{\"iron\": 120000, \"wood\": 120000, \"stone\": 90000, \"wheat\": 80000}','{\"defense_power\": 180000, \"storage_capacity\": 450000, \"civilization_points\": 65, \"population_consumers\": 39}',1728000),(221,7,17,'{\"iron\": 150000, \"wood\": 150000, \"stone\": 120000, \"wheat\": 100000}','{\"defense_power\": 200000, \"storage_capacity\": 500000, \"civilization_points\": 68, \"population_consumers\": 41}',2073600),(222,7,18,'{\"iron\": 170000, \"wood\": 170000, \"stone\": 140000, \"wheat\": 120000}','{\"defense_power\": 230000, \"storage_capacity\": 600000, \"civilization_points\": 70, \"population_consumers\": 43}',2592000),(223,7,19,'{\"iron\": 180000, \"wood\": 180000, \"stone\": 150000, \"wheat\": 130000}','{\"defense_power\": 260000, \"storage_capacity\": 800000, \"civilization_points\": 72, \"population_consumers\": 46}',3456000),(224,7,20,'{\"iron\": 220000, \"wood\": 220000, \"stone\": 170000, \"wheat\": 160000}','{\"defense_power\": 300000, \"storage_capacity\": 1000000, \"civilization_points\": 75, \"population_consumers\": 50}',4320000),(225,7,21,'{\"iron\": 300000, \"wood\": 300000, \"stone\": 220000, \"wheat\": 200000}','{\"defense_power\": 340000, \"storage_capacity\": 1200000, \"civilization_points\": 80, \"population_consumers\": 51}',5184000),(226,7,22,'{\"iron\": 350000, \"wood\": 350000, \"stone\": 270000, \"wheat\": 250000}','{\"defense_power\": 380000, \"storage_capacity\": 1500000, \"civilization_points\": 90, \"population_consumers\": 54}',6048000),(227,7,23,'{\"iron\": 400000, \"wood\": 400000, \"stone\": 330000, \"wheat\": 300000}','{\"defense_power\": 420000, \"storage_capacity\": 2000000, \"civilization_points\": 95, \"population_consumers\": 56}',6912000),(228,7,24,'{\"iron\": 450000, \"wood\": 450000, \"stone\": 400000, \"wheat\": 350000}','{\"defense_power\": 460000, \"storage_capacity\": 2500000, \"civilization_points\": 100, \"population_consumers\": 59}',7776000),(229,7,25,'{\"iron\": 750000, \"wood\": 750000, \"stone\": 600000, \"wheat\": 500000}','{\"defense_power\": 500000, \"storage_capacity\": 3500000, \"civilization_points\": 110, \"population_consumers\": 62}',8640000),(230,7,26,'{\"iron\": 950000, \"wood\": 950000, \"stone\": 700000, \"wheat\": 600000}','{\"defense_power\": 550000, \"storage_capacity\": 4000000, \"civilization_points\": 140, \"population_consumers\": 65}',10368000),(231,7,27,'{\"iron\": 1100000, \"wood\": 1100000, \"stone\": 850000, \"wheat\": 800000}','{\"defense_power\": 600000, \"storage_capacity\": 5000000, \"civilization_points\": 150, \"population_consumers\": 69}',12096000),(232,7,28,'{\"iron\": 1200000, \"wood\": 1200000, \"stone\": 900000, \"wheat\": 850000}','{\"defense_power\": 700000, \"storage_capacity\": 6000000, \"civilization_points\": 155, \"population_consumers\": 73}',13824000),(233,7,29,'{\"iron\": 1400000, \"wood\": 1400000, \"stone\": 1100000, \"wheat\": 1000000}','{\"defense_power\": 800000, \"storage_capacity\": 8000000, \"civilization_points\": 160, \"population_consumers\": 77}',15552000),(234,7,30,'{\"iron\": 2500000, \"wood\": 2500000, \"stone\": 1800000, \"wheat\": 1500000}','{\"defense_power\": 900000, \"storage_capacity\": 10000000, \"civilization_points\": 190, \"population_consumers\": 81}',17280000),(235,8,1,'{\"iron\": 250, \"wood\": 250, \"stone\": 250, \"wheat\": 250}','{\"defense_power\": 5000, \"civilization_points\": 5, \"population_consumers\": 3, \"defense_power_increase_percent\": 0}',600),(236,8,2,'{\"iron\": 800, \"wood\": 800, \"stone\": 800, \"wheat\": 800}','{\"defense_power\": 12000, \"civilization_points\": 10, \"population_consumers\": 5, \"defense_power_increase_percent\": 2}',900),(237,8,3,'{\"iron\": 1200, \"wood\": 1200, \"stone\": 1200, \"wheat\": 1200}','{\"defense_power\": 19000, \"civilization_points\": 15, \"population_consumers\": 9, \"defense_power_increase_percent\": 4}',1200),(238,8,4,'{\"iron\": 1500, \"wood\": 1500, \"stone\": 1500, \"wheat\": 1500}','{\"defense_power\": 26000, \"civilization_points\": 20, \"population_consumers\": 10, \"defense_power_increase_percent\": 5}',1380),(239,8,5,'{\"iron\": 2000, \"wood\": 2000, \"stone\": 2000, \"wheat\": 2000}','{\"defense_power\": 34000, \"civilization_points\": 22, \"population_consumers\": 12, \"defense_power_increase_percent\": 7}',1800),(240,8,6,'{\"iron\": 5000, \"wood\": 5000, \"stone\": 5000, \"wheat\": 5000}','{\"defense_power\": 42000, \"civilization_points\": 25, \"population_consumers\": 15, \"defense_power_increase_percent\": 8}',7800),(241,8,7,'{\"iron\": 10000, \"wood\": 10000, \"stone\": 10000, \"wheat\": 10000}','{\"defense_power\": 50000, \"civilization_points\": 28, \"population_consumers\": 19, \"defense_power_increase_percent\": 9}',12300),(242,8,8,'{\"iron\": 15000, \"wood\": 15000, \"stone\": 15000, \"wheat\": 15000}','{\"defense_power\": 62000, \"civilization_points\": 30, \"population_consumers\": 22, \"defense_power_increase_percent\": 11}',20400),(243,8,9,'{\"iron\": 25000, \"wood\": 25000, \"stone\": 25000, \"wheat\": 25000}','{\"defense_power\": 74000, \"civilization_points\": 35, \"population_consumers\": 24, \"defense_power_increase_percent\": 13}',57000),(244,8,10,'{\"iron\": 45000, \"wood\": 45000, \"stone\": 45000, \"wheat\": 45000}','{\"defense_power\": 86000, \"civilization_points\": 40, \"population_consumers\": 26, \"defense_power_increase_percent\": 15}',79920),(245,8,11,'{\"iron\": 70000, \"wood\": 70000, \"stone\": 70000, \"wheat\": 70000}','{\"defense_power\": 98000, \"civilization_points\": 42, \"population_consumers\": 29, \"defense_power_increase_percent\": 16}',186240),(246,8,12,'{\"iron\": 100000, \"wood\": 100000, \"stone\": 100000, \"wheat\": 100000}','{\"defense_power\": 110000, \"civilization_points\": 48, \"population_consumers\": 30, \"defense_power_increase_percent\": 17}',259200),(247,8,13,'{\"iron\": 150000, \"wood\": 150000, \"stone\": 150000, \"wheat\": 150000}','{\"defense_power\": 125000, \"civilization_points\": 50, \"population_consumers\": 34, \"defense_power_increase_percent\": 19}',267840),(248,8,14,'{\"iron\": 250000, \"wood\": 250000, \"stone\": 250000, \"wheat\": 250000}','{\"defense_power\": 140000, \"civilization_points\": 60, \"population_consumers\": 37, \"defense_power_increase_percent\": 20}',267840),(249,8,15,'{\"iron\": 350000, \"wood\": 350000, \"stone\": 350000, \"wheat\": 350000}','{\"defense_power\": 160000, \"civilization_points\": 65, \"population_consumers\": 40, \"defense_power_increase_percent\": 22}',345600),(250,8,16,'{\"iron\": 500000, \"wood\": 500000, \"stone\": 500000, \"wheat\": 500000}','{\"defense_power\": 180000, \"civilization_points\": 68, \"population_consumers\": 44, \"defense_power_increase_percent\": 25}',388800),(251,8,17,'{\"iron\": 800000, \"wood\": 800000, \"stone\": 800000, \"wheat\": 800000}','{\"defense_power\": 200000, \"civilization_points\": 70, \"population_consumers\": 47, \"defense_power_increase_percent\": 28}',450000),(252,8,18,'{\"iron\": 1000000, \"wood\": 1000000, \"stone\": 1000000, \"wheat\": 1000000}','{\"defense_power\": 230000, \"civilization_points\": 72, \"population_consumers\": 51, \"defense_power_increase_percent\": 30}',561600),(253,8,19,'{\"iron\": 1500000, \"wood\": 1500000, \"stone\": 1500000, \"wheat\": 1500000}','{\"defense_power\": 300000, \"civilization_points\": 75, \"population_consumers\": 55, \"defense_power_increase_percent\": 35}',604800),(254,8,20,'{\"iron\": 2000000, \"wood\": 2000000, \"stone\": 2000000, \"wheat\": 2000000}','{\"defense_power\": 400000, \"civilization_points\": 80, \"population_consumers\": 60, \"defense_power_increase_percent\": 40}',691200),(255,9,1,'{\"iron\": 250000, \"wood\": 250000, \"stone\": 250000, \"wheat\": 100000}','{\"defense_power\": 5000, \"civilization_points\": 5, \"population_consumers\": 3, \"defense_power_increase_percent\": 5}',216000),(256,9,2,'{\"iron\": 400000, \"wood\": 400000, \"stone\": 400000, \"wheat\": 250000}','{\"defense_power\": 15000, \"civilization_points\": 10, \"population_consumers\": 5, \"defense_power_increase_percent\": 10}',240000),(257,9,3,'{\"iron\": 500000, \"wood\": 500000, \"stone\": 500000, \"wheat\": 350000}','{\"defense_power\": 25000, \"civilization_points\": 15, \"population_consumers\": 8, \"defense_power_increase_percent\": 15}',302400),(258,9,4,'{\"iron\": 600000, \"wood\": 600000, \"stone\": 600000, \"wheat\": 400000}','{\"defense_power\": 40000, \"civilization_points\": 20, \"population_consumers\": 11, \"defense_power_increase_percent\": 20}',366000),(259,9,5,'{\"iron\": 800000, \"wood\": 800000, \"stone\": 800000, \"wheat\": 600000}','{\"defense_power\": 60000, \"civilization_points\": 22, \"population_consumers\": 15, \"defense_power_increase_percent\": 25}',366000),(260,9,6,'{\"iron\": 1100000, \"wood\": 1100000, \"stone\": 1100000, \"wheat\": 800000}','{\"defense_power\": 80000, \"civilization_points\": 25, \"population_consumers\": 18, \"defense_power_increase_percent\": 30}',432000),(261,9,7,'{\"iron\": 1400000, \"wood\": 1400000, \"stone\": 1400000, \"wheat\": 1000000}','{\"defense_power\": 120000, \"civilization_points\": 28, \"population_consumers\": 22, \"defense_power_increase_percent\": 40}',604800),(262,9,8,'{\"iron\": 1700000, \"wood\": 1700000, \"stone\": 1700000, \"wheat\": 1100000}','{\"defense_power\": 160000, \"civilization_points\": 30, \"population_consumers\": 25, \"defense_power_increase_percent\": 50}',1036800),(263,9,9,'{\"iron\": 2000000, \"wood\": 2000000, \"stone\": 2000000, \"wheat\": 1200000}','{\"defense_power\": 200000, \"civilization_points\": 35, \"population_consumers\": 29, \"defense_power_increase_percent\": 60}',950400),(264,9,10,'{\"iron\": 3500000, \"wood\": 3500000, \"stone\": 3500000, \"wheat\": 1500000}','{\"defense_power\": 300000, \"civilization_points\": 40, \"population_consumers\": 33, \"defense_power_increase_percent\": 70}',950400),(265,10,1,'{\"iron\": 2500, \"wood\": 2000, \"stone\": 1500, \"wheat\": 1000}','{\"defense_power\": 8000, \"civilization_points\": 5, \"population_consumers\": 3, \"training_time_reduction_percent\": 0}',600),(266,10,2,'{\"iron\": 3000, \"wood\": 2500, \"stone\": 2000, \"wheat\": 1500}','{\"defense_power\": 20000, \"civilization_points\": 10, \"population_consumers\": 7, \"training_time_reduction_percent\": 1}',900),(267,10,3,'{\"iron\": 4000, \"wood\": 3500, \"stone\": 3000, \"wheat\": 2500}','{\"defense_power\": 32000, \"civilization_points\": 15, \"population_consumers\": 10, \"training_time_reduction_percent\": 2}',1200),(268,10,4,'{\"iron\": 6000, \"wood\": 5000, \"stone\": 4000, \"wheat\": 3500}','{\"defense_power\": 45000, \"civilization_points\": 20, \"population_consumers\": 13, \"training_time_reduction_percent\": 4}',2400),(269,10,5,'{\"iron\": 7000, \"wood\": 6000, \"stone\": 4500, \"wheat\": 4000}','{\"defense_power\": 58000, \"civilization_points\": 22, \"population_consumers\": 15, \"training_time_reduction_percent\": 5}',3480),(270,10,6,'{\"iron\": 22000, \"wood\": 25000, \"stone\": 15000, \"wheat\": 10000}','{\"defense_power\": 70000, \"civilization_points\": 25, \"population_consumers\": 19, \"training_time_reduction_percent\": 6}',11400),(271,10,7,'{\"iron\": 35000, \"wood\": 40000, \"stone\": 25000, \"wheat\": 20000}','{\"defense_power\": 90000, \"civilization_points\": 28, \"population_consumers\": 21, \"training_time_reduction_percent\": 8}',19500),(272,10,8,'{\"iron\": 60000, \"wood\": 70000, \"stone\": 50000, \"wheat\": 40000}','{\"defense_power\": 110000, \"civilization_points\": 30, \"population_consumers\": 24, \"training_time_reduction_percent\": 9}',38400),(273,10,9,'{\"iron\": 90000, \"wood\": 100000, \"stone\": 80000, \"wheat\": 65000}','{\"defense_power\": 130000, \"civilization_points\": 35, \"population_consumers\": 26, \"training_time_reduction_percent\": 10}',71400),(274,10,10,'{\"iron\": 155000, \"wood\": 170000, \"stone\": 130000, \"wheat\": 100000}','{\"defense_power\": 150000, \"civilization_points\": 40, \"population_consumers\": 30, \"training_time_reduction_percent\": 12}',93600),(275,10,11,'{\"iron\": 230000, \"wood\": 250000, \"stone\": 190000, \"wheat\": 150000}','{\"defense_power\": 170000, \"civilization_points\": 42, \"population_consumers\": 33, \"training_time_reduction_percent\": 14}',122400),(276,10,12,'{\"iron\": 320000, \"wood\": 350000, \"stone\": 250000, \"wheat\": 200000}','{\"defense_power\": 190000, \"civilization_points\": 44, \"population_consumers\": 35, \"training_time_reduction_percent\": 16}',165600),(277,10,13,'{\"iron\": 600000, \"wood\": 700000, \"stone\": 450000, \"wheat\": 350000}','{\"defense_power\": 210000, \"civilization_points\": 48, \"population_consumers\": 38, \"training_time_reduction_percent\": 17}',187200),(278,10,14,'{\"iron\": 850000, \"wood\": 1000000, \"stone\": 650000, \"wheat\": 500000}','{\"defense_power\": 230000, \"civilization_points\": 50, \"population_consumers\": 42, \"training_time_reduction_percent\": 19}',189000),(279,10,15,'{\"iron\": 1000000, \"wood\": 1300000, \"stone\": 900000, \"wheat\": 700000}','{\"defense_power\": 250000, \"civilization_points\": 60, \"population_consumers\": 45, \"training_time_reduction_percent\": 20}',207000),(280,10,16,'{\"iron\": 1500000, \"wood\": 1700000, \"stone\": 1200000, \"wheat\": 1000000}','{\"defense_power\": 300000, \"civilization_points\": 80, \"population_consumers\": 48, \"training_time_reduction_percent\": 22}',345000),(281,10,17,'{\"iron\": 2000000, \"wood\": 2300000, \"stone\": 1700000, \"wheat\": 1400000}','{\"defense_power\": 400000, \"civilization_points\": 90, \"population_consumers\": 52, \"training_time_reduction_percent\": 24}',432000),(282,10,18,'{\"iron\": 2400000, \"wood\": 2800000, \"stone\": 2200000, \"wheat\": 1900000}','{\"defense_power\": 500000, \"civilization_points\": 100, \"population_consumers\": 56, \"training_time_reduction_percent\": 26}',547200),(283,10,19,'{\"iron\": 3000000, \"wood\": 3300000, \"stone\": 2700000, \"wheat\": 2400000}','{\"defense_power\": 600000, \"civilization_points\": 110, \"population_consumers\": 60, \"training_time_reduction_percent\": 30}',576000),(284,10,20,'{\"iron\": 4500000, \"wood\": 5000000, \"stone\": 3500000, \"wheat\": 3500000}','{\"defense_power\": 700000, \"civilization_points\": 120, \"population_consumers\": 64, \"training_time_reduction_percent\": 35}',873000),(285,11,1,'{\"iron\": 1200, \"wood\": 2000, \"stone\": 1500, \"wheat\": 800}','{\"defense_power\": 5000, \"troop_speed_boost\": 0, \"civilization_points\": 5, \"population_consumers\": 3, \"training_time_reduction\": 0}',60),(286,11,2,'{\"iron\": 2400, \"wood\": 4000, \"stone\": 3000, \"wheat\": 1600}','{\"defense_power\": 12000, \"troop_speed_boost\": 1, \"civilization_points\": 15, \"population_consumers\": 6, \"training_time_reduction\": 2}',120),(287,11,3,'{\"iron\": 3600, \"wood\": 6000, \"stone\": 4500, \"wheat\": 2400}','{\"defense_power\": 19000, \"troop_speed_boost\": 2, \"civilization_points\": 25, \"population_consumers\": 10, \"training_time_reduction\": 4}',180),(288,11,4,'{\"iron\": 4800, \"wood\": 8000, \"stone\": 6000, \"wheat\": 3200}','{\"defense_power\": 26000, \"troop_speed_boost\": 3, \"civilization_points\": 40, \"population_consumers\": 14, \"training_time_reduction\": 5}',300),(289,11,5,'{\"iron\": 6000, \"wood\": 10000, \"stone\": 7500, \"wheat\": 4000}','{\"defense_power\": 34000, \"troop_speed_boost\": 5, \"civilization_points\": 60, \"population_consumers\": 17, \"training_time_reduction\": 6}',600),(290,11,6,'{\"iron\": 7200, \"wood\": 12000, \"stone\": 9000, \"wheat\": 4800}','{\"defense_power\": 42000, \"troop_speed_boost\": 7, \"civilization_points\": 70, \"population_consumers\": 20, \"training_time_reduction\": 7}',900),(291,11,7,'{\"iron\": 8400, \"wood\": 14000, \"stone\": 11000, \"wheat\": 5600}','{\"defense_power\": 50000, \"troop_speed_boost\": 8, \"civilization_points\": 80, \"population_consumers\": 24, \"training_time_reduction\": 10}',1200),(292,11,8,'{\"iron\": 9600, \"wood\": 16000, \"stone\": 13000, \"wheat\": 6400}','{\"defense_power\": 62000, \"troop_speed_boost\": 9, \"civilization_points\": 100, \"population_consumers\": 26, \"training_time_reduction\": 12}',1800),(293,11,9,'{\"iron\": 12000, \"wood\": 20000, \"stone\": 16000, \"wheat\": 8000}','{\"defense_power\": 74000, \"troop_speed_boost\": 10, \"civilization_points\": 115, \"population_consumers\": 30, \"training_time_reduction\": 15}',2400),(294,11,10,'{\"iron\": 14000, \"wood\": 24000, \"stone\": 18000, \"wheat\": 9600}','{\"defense_power\": 86000, \"troop_speed_boost\": 12, \"civilization_points\": 130, \"population_consumers\": 33, \"training_time_reduction\": 18}',3000),(295,11,11,'{\"iron\": 18000, \"wood\": 30000, \"stone\": 22000, \"wheat\": 12000}','{\"defense_power\": 98000, \"troop_speed_boost\": 14, \"civilization_points\": 150, \"population_consumers\": 36, \"training_time_reduction\": 20}',3600),(296,11,12,'{\"iron\": 22000, \"wood\": 35000, \"stone\": 26000, \"wheat\": 14000}','{\"defense_power\": 110000, \"troop_speed_boost\": 16, \"civilization_points\": 170, \"population_consumers\": 40, \"training_time_reduction\": 25}',4200),(297,11,13,'{\"iron\": 26000, \"wood\": 40000, \"stone\": 30000, \"wheat\": 16000}','{\"defense_power\": 125000, \"troop_speed_boost\": 18, \"civilization_points\": 180, \"population_consumers\": 44, \"training_time_reduction\": 27}',4800),(298,11,14,'{\"iron\": 30000, \"wood\": 45000, \"stone\": 34000, \"wheat\": 18000}','{\"defense_power\": 140000, \"troop_speed_boost\": 19, \"civilization_points\": 185, \"population_consumers\": 47, \"training_time_reduction\": 30}',5400),(299,11,15,'{\"iron\": 34000, \"wood\": 50000, \"stone\": 38000, \"wheat\": 20000}','{\"defense_power\": 160000, \"troop_speed_boost\": 20, \"civilization_points\": 190, \"population_consumers\": 50, \"training_time_reduction\": 33}',6000),(300,11,16,'{\"iron\": 750000, \"wood\": 600000, \"stone\": 850000, \"wheat\": 1000000}','{\"defense_power\": 180000, \"troop_speed_boost\": 21, \"civilization_points\": 195, \"population_consumers\": 54, \"training_time_reduction\": 35}',432000),(301,11,17,'{\"iron\": 900000, \"wood\": 800000, \"stone\": 1000000, \"wheat\": 1200000}','{\"defense_power\": 200000, \"troop_speed_boost\": 22, \"civilization_points\": 200, \"population_consumers\": 56, \"training_time_reduction\": 39}',1980000),(302,11,18,'{\"iron\": 1000000, \"wood\": 900000, \"stone\": 1100000, \"wheat\": 1300000}','{\"defense_power\": 230000, \"troop_speed_boost\": 24, \"civilization_points\": 205, \"population_consumers\": 60, \"training_time_reduction\": 40}',561600),(303,11,19,'{\"iron\": 1100000, \"wood\": 1000000, \"stone\": 1200000, \"wheat\": 1400000}','{\"defense_power\": 260000, \"troop_speed_boost\": 25, \"civilization_points\": 215, \"population_consumers\": 63, \"training_time_reduction\": 42}',604800),(304,11,20,'{\"iron\": 1300000, \"wood\": 1200000, \"stone\": 1500000, \"wheat\": 1700000}','{\"defense_power\": 300000, \"troop_speed_boost\": 26, \"civilization_points\": 220, \"population_consumers\": 67, \"training_time_reduction\": 44}',612000),(305,11,21,'{\"iron\": 1400000, \"wood\": 1300000, \"stone\": 1600000, \"wheat\": 1800000}','{\"defense_power\": 340000, \"troop_speed_boost\": 27, \"civilization_points\": 225, \"population_consumers\": 71, \"training_time_reduction\": 45}',734000),(306,11,22,'{\"iron\": 1600000, \"wood\": 1500000, \"stone\": 1800000, \"wheat\": 2000000}','{\"defense_power\": 380000, \"troop_speed_boost\": 29, \"civilization_points\": 230, \"population_consumers\": 75, \"training_time_reduction\": 47}',734000),(307,11,23,'{\"iron\": 1800000, \"wood\": 1700000, \"stone\": 2000000, \"wheat\": 2200000}','{\"defense_power\": 420000, \"troop_speed_boost\": 30, \"civilization_points\": 240, \"population_consumers\": 77, \"training_time_reduction\": 48}',864000),(308,11,24,'{\"iron\": 2200000, \"wood\": 2000000, \"stone\": 2400000, \"wheat\": 2500000}','{\"defense_power\": 460000, \"troop_speed_boost\": 31, \"civilization_points\": 245, \"population_consumers\": 80, \"training_time_reduction\": 50}',864000),(309,11,25,'{\"iron\": 2400000, \"wood\": 2200000, \"stone\": 2500000, \"wheat\": 2700000}','{\"defense_power\": 500000, \"troop_speed_boost\": 32, \"civilization_points\": 250, \"population_consumers\": 83, \"training_time_reduction\": 55}',864000),(310,11,26,'{\"iron\": 2800000, \"wood\": 2500000, \"stone\": 3000000, \"wheat\": 3500000}','{\"defense_power\": 550000, \"troop_speed_boost\": 35, \"civilization_points\": 255, \"population_consumers\": 86, \"training_time_reduction\": 58}',864000),(311,11,27,'{\"iron\": 3000000, \"wood\": 2700000, \"stone\": 3300000, \"wheat\": 4000000}','{\"defense_power\": 600000, \"troop_speed_boost\": 37, \"civilization_points\": 260, \"population_consumers\": 90, \"training_time_reduction\": 62}',864000),(312,11,28,'{\"iron\": 3200000, \"wood\": 3000000, \"stone\": 3500000, \"wheat\": 4500000}','{\"defense_power\": 700000, \"troop_speed_boost\": 39, \"civilization_points\": 270, \"population_consumers\": 94, \"training_time_reduction\": 65}',864000),(313,11,29,'{\"iron\": 3500000, \"wood\": 3500000, \"stone\": 4000000, \"wheat\": 5000000}','{\"defense_power\": 800000, \"troop_speed_boost\": 42, \"civilization_points\": 275, \"population_consumers\": 98, \"training_time_reduction\": 70}',864000),(314,11,30,'{\"iron\": 4000000, \"wood\": 4000000, \"stone\": 4500000, \"wheat\": 6000000}','{\"defense_power\": 900000, \"troop_speed_boost\": 45, \"civilization_points\": 300, \"population_consumers\": 98, \"training_time_reduction\": 80}',864000),(333,12,1,'{\"iron\": 2500, \"wood\": 1500, \"stone\": 2000, \"wheat\": 1000}','{\"defense_power\": 5000, \"troop_speed_boost\": 0, \"civilization_points\": 5, \"population_consumers\": 3, \"training_time_reduction\": 0}',600),(334,12,2,'{\"iron\": 3000, \"wood\": 2000, \"stone\": 2500, \"wheat\": 1500}','{\"defense_power\": 12000, \"troop_speed_boost\": 1, \"civilization_points\": 15, \"population_consumers\": 6, \"training_time_reduction\": 2}',900),(335,12,3,'{\"iron\": 4000, \"wood\": 3000, \"stone\": 3500, \"wheat\": 2500}','{\"defense_power\": 19000, \"troop_speed_boost\": 2, \"civilization_points\": 25, \"population_consumers\": 10, \"training_time_reduction\": 4}',1200),(336,12,4,'{\"iron\": 6000, \"wood\": 4000, \"stone\": 4500, \"wheat\": 3500}','{\"defense_power\": 26000, \"troop_speed_boost\": 3, \"civilization_points\": 40, \"population_consumers\": 14, \"training_time_reduction\": 5}',2400),(337,12,5,'{\"iron\": 12000, \"wood\": 7000, \"stone\": 9000, \"wheat\": 6000}','{\"defense_power\": 34000, \"troop_speed_boost\": 5, \"civilization_points\": 60, \"population_consumers\": 17, \"training_time_reduction\": 6}',8400),(338,12,6,'{\"iron\": 20000, \"wood\": 10000, \"stone\": 14000, \"wheat\": 9000}','{\"defense_power\": 42000, \"troop_speed_boost\": 7, \"civilization_points\": 70, \"population_consumers\": 20, \"training_time_reduction\": 7}',15600),(339,12,7,'{\"iron\": 30000, \"wood\": 20000, \"stone\": 22000, \"wheat\": 14000}','{\"defense_power\": 50000, \"troop_speed_boost\": 8, \"civilization_points\": 80, \"population_consumers\": 24, \"training_time_reduction\": 10}',29400),(340,12,8,'{\"iron\": 50000, \"wood\": 35000, \"stone\": 40000, \"wheat\": 25000}','{\"defense_power\": 62000, \"troop_speed_boost\": 9, \"civilization_points\": 100, \"population_consumers\": 26, \"training_time_reduction\": 12}',61500),(341,12,9,'{\"iron\": 80000, \"wood\": 55000, \"stone\": 65000, \"wheat\": 40000}','{\"defense_power\": 74000, \"troop_speed_boost\": 10, \"civilization_points\": 115, \"population_consumers\": 30, \"training_time_reduction\": 15}',70800),(342,12,10,'{\"iron\": 120000, \"wood\": 90000, \"stone\": 100000, \"wheat\": 65000}','{\"defense_power\": 86000, \"troop_speed_boost\": 12, \"civilization_points\": 130, \"population_consumers\": 33, \"training_time_reduction\": 18}',85800),(343,12,11,'{\"iron\": 200000, \"wood\": 130000, \"stone\": 150000, \"wheat\": 100000}','{\"defense_power\": 98000, \"troop_speed_boost\": 14, \"civilization_points\": 150, \"population_consumers\": 36, \"training_time_reduction\": 20}',129600),(344,12,12,'{\"iron\": 250000, \"wood\": 190000, \"stone\": 220000, \"wheat\": 150000}','{\"defense_power\": 110000, \"troop_speed_boost\": 16, \"civilization_points\": 170, \"population_consumers\": 40, \"training_time_reduction\": 25}',129600),(345,12,13,'{\"iron\": 380000, \"wood\": 250000, \"stone\": 300000, \"wheat\": 190000}','{\"defense_power\": 125000, \"troop_speed_boost\": 18, \"civilization_points\": 180, \"population_consumers\": 44, \"training_time_reduction\": 27}',129600),(346,12,14,'{\"iron\": 500000, \"wood\": 350000, \"stone\": 400000, \"wheat\": 250000}','{\"defense_power\": 140000, \"troop_speed_boost\": 19, \"civilization_points\": 185, \"population_consumers\": 47, \"training_time_reduction\": 30}',129600),(347,12,15,'{\"iron\": 850000, \"wood\": 600000, \"stone\": 700000, \"wheat\": 450000}','{\"defense_power\": 160000, \"troop_speed_boost\": 20, \"civilization_points\": 190, \"population_consumers\": 50, \"training_time_reduction\": 33}',172800),(348,12,16,'{\"iron\": 1000000, \"wood\": 750000, \"stone\": 850000, \"wheat\": 600000}','{\"defense_power\": 180000, \"troop_speed_boost\": 21, \"civilization_points\": 195, \"population_consumers\": 54, \"training_time_reduction\": 35}',172800),(349,12,17,'{\"iron\": 1200000, \"wood\": 900000, \"stone\": 1000000, \"wheat\": 800000}','{\"defense_power\": 200000, \"troop_speed_boost\": 22, \"civilization_points\": 200, \"population_consumers\": 56, \"training_time_reduction\": 39}',216000),(350,12,18,'{\"iron\": 1300000, \"wood\": 1000000, \"stone\": 1100000, \"wheat\": 900000}','{\"defense_power\": 230000, \"troop_speed_boost\": 24, \"civilization_points\": 205, \"population_consumers\": 60, \"training_time_reduction\": 40}',259200),(351,12,19,'{\"iron\": 1400000, \"wood\": 1100000, \"stone\": 1200000, \"wheat\": 1000000}','{\"defense_power\": 260000, \"troop_speed_boost\": 25, \"civilization_points\": 215, \"population_consumers\": 63, \"training_time_reduction\": 42}',302400),(352,12,20,'{\"iron\": 1500000, \"wood\": 1200000, \"stone\": 1300000, \"wheat\": 1200000}','{\"defense_power\": 300000, \"troop_speed_boost\": 26, \"civilization_points\": 220, \"population_consumers\": 67, \"training_time_reduction\": 44}',345600),(353,12,21,'{\"iron\": 1800000, \"wood\": 1400000, \"stone\": 1400000, \"wheat\": 1400000}','{\"defense_power\": 340000, \"troop_speed_boost\": 27, \"civilization_points\": 225, \"population_consumers\": 71, \"training_time_reduction\": 45}',388800),(354,12,22,'{\"iron\": 2000000, \"wood\": 1600000, \"stone\": 1600000, \"wheat\": 1600000}','{\"defense_power\": 380000, \"troop_speed_boost\": 29, \"civilization_points\": 230, \"population_consumers\": 75, \"training_time_reduction\": 47}',432000),(355,12,23,'{\"iron\": 2500000, \"wood\": 1800000, \"stone\": 1800000, \"wheat\": 1800000}','{\"defense_power\": 450000, \"troop_speed_boost\": 30, \"civilization_points\": 240, \"population_consumers\": 77, \"training_time_reduction\": 48}',518400),(356,12,24,'{\"iron\": 3000000, \"wood\": 2000000, \"stone\": 2000000, \"wheat\": 2000000}','{\"defense_power\": 520000, \"troop_speed_boost\": 31, \"civilization_points\": 245, \"population_consumers\": 80, \"training_time_reduction\": 50}',576000),(357,12,25,'{\"iron\": 3500000, \"wood\": 2200000, \"stone\": 2200000, \"wheat\": 2200000}','{\"defense_power\": 600000, \"troop_speed_boost\": 32, \"civilization_points\": 250, \"population_consumers\": 83, \"training_time_reduction\": 55}',648000),(358,12,26,'{\"iron\": 4000000, \"wood\": 2400000, \"stone\": 2400000, \"wheat\": 2400000}','{\"defense_power\": 700000, \"troop_speed_boost\": 35, \"civilization_points\": 255, \"population_consumers\": 86, \"training_time_reduction\": 58}',720000),(359,12,27,'{\"iron\": 4500000, \"wood\": 2600000, \"stone\": 2600000, \"wheat\": 2600000}','{\"defense_power\": 800000, \"troop_speed_boost\": 37, \"civilization_points\": 260, \"population_consumers\": 90, \"training_time_reduction\": 62}',864000),(360,12,28,'{\"iron\": 5000000, \"wood\": 2800000, \"stone\": 2800000, \"wheat\": 2800000}','{\"defense_power\": 900000, \"troop_speed_boost\": 39, \"civilization_points\": 270, \"population_consumers\": 94, \"training_time_reduction\": 65}',1008000),(361,12,29,'{\"iron\": 6000000, \"wood\": 3000000, \"stone\": 3000000, \"wheat\": 3000000}','{\"defense_power\": 1000000, \"troop_speed_boost\": 42, \"civilization_points\": 275, \"population_consumers\": 98, \"training_time_reduction\": 70}',1296000),(362,12,30,'{\"iron\": 7000000, \"wood\": 3500000, \"stone\": 3500000, \"wheat\": 3500000}','{\"defense_power\": 1200000, \"troop_speed_boost\": 45, \"civilization_points\": 290, \"population_consumers\": 98, \"training_time_reduction\": 80}',1728000),(363,13,1,'{\"iron\": 2500, \"wood\": 1500, \"stone\": 2000, \"wheat\": 1000}','{\"defense_power\": 5000, \"troop_speed_boost\": 0, \"civilization_points\": 5, \"population_consumers\": 3, \"training_time_reduction\": 0}',600),(364,13,2,'{\"iron\": 3000, \"wood\": 2000, \"stone\": 2500, \"wheat\": 1500}','{\"defense_power\": 12000, \"troop_speed_boost\": 1, \"civilization_points\": 15, \"population_consumers\": 6, \"training_time_reduction\": 2}',900),(365,13,3,'{\"iron\": 4000, \"wood\": 3000, \"stone\": 3500, \"wheat\": 2500}','{\"defense_power\": 19000, \"troop_speed_boost\": 2, \"civilization_points\": 25, \"population_consumers\": 10, \"training_time_reduction\": 4}',1200),(366,13,4,'{\"iron\": 6000, \"wood\": 4000, \"stone\": 4500, \"wheat\": 3500}','{\"defense_power\": 26000, \"troop_speed_boost\": 3, \"civilization_points\": 40, \"population_consumers\": 14, \"training_time_reduction\": 5}',2400),(367,13,5,'{\"iron\": 12000, \"wood\": 7000, \"stone\": 9000, \"wheat\": 6000}','{\"defense_power\": 34000, \"troop_speed_boost\": 5, \"civilization_points\": 60, \"population_consumers\": 17, \"training_time_reduction\": 6}',8400),(368,13,6,'{\"iron\": 20000, \"wood\": 10000, \"stone\": 14000, \"wheat\": 9000}','{\"defense_power\": 42000, \"troop_speed_boost\": 7, \"civilization_points\": 70, \"population_consumers\": 20, \"training_time_reduction\": 7}',15600),(369,13,7,'{\"iron\": 30000, \"wood\": 20000, \"stone\": 22000, \"wheat\": 14000}','{\"defense_power\": 50000, \"troop_speed_boost\": 8, \"civilization_points\": 80, \"population_consumers\": 24, \"training_time_reduction\": 10}',29400),(370,13,8,'{\"iron\": 50000, \"wood\": 35000, \"stone\": 40000, \"wheat\": 25000}','{\"defense_power\": 62000, \"troop_speed_boost\": 9, \"civilization_points\": 100, \"population_consumers\": 26, \"training_time_reduction\": 12}',61500),(371,13,9,'{\"iron\": 80000, \"wood\": 60000, \"stone\": 65000, \"wheat\": 40000}','{\"defense_power\": 74000, \"troop_speed_boost\": 10, \"civilization_points\": 115, \"population_consumers\": 30, \"training_time_reduction\": 15}',108000),(372,13,10,'{\"iron\": 100000, \"wood\": 80000, \"stone\": 90000, \"wheat\": 65000}','{\"defense_power\": 86000, \"troop_speed_boost\": 12, \"civilization_points\": 130, \"population_consumers\": 33, \"training_time_reduction\": 18}',129600),(373,13,11,'{\"iron\": 130000, \"wood\": 110000, \"stone\": 120000, \"wheat\": 90000}','{\"defense_power\": 98000, \"troop_speed_boost\": 14, \"civilization_points\": 150, \"population_consumers\": 36, \"training_time_reduction\": 20}',155520),(374,13,12,'{\"iron\": 160000, \"wood\": 140000, \"stone\": 150000, \"wheat\": 120000}','{\"defense_power\": 110000, \"troop_speed_boost\": 16, \"civilization_points\": 170, \"population_consumers\": 40, \"training_time_reduction\": 25}',172800),(375,13,13,'{\"iron\": 220000, \"wood\": 180000, \"stone\": 200000, \"wheat\": 150000}','{\"defense_power\": 125000, \"troop_speed_boost\": 18, \"civilization_points\": 180, \"population_consumers\": 44, \"training_time_reduction\": 27}',216000),(376,13,14,'{\"iron\": 270000, \"wood\": 230000, \"stone\": 250000, \"wheat\": 200000}','{\"defense_power\": 140000, \"troop_speed_boost\": 19, \"civilization_points\": 185, \"population_consumers\": 47, \"training_time_reduction\": 30}',259200),(377,13,15,'{\"iron\": 350000, \"wood\": 300000, \"stone\": 300000, \"wheat\": 250000}','{\"defense_power\": 160000, \"troop_speed_boost\": 20, \"civilization_points\": 190, \"population_consumers\": 50, \"training_time_reduction\": 33}',302400),(378,13,16,'{\"iron\": 450000, \"wood\": 400000, \"stone\": 350000, \"wheat\": 300000}','{\"defense_power\": 180000, \"troop_speed_boost\": 21, \"civilization_points\": 195, \"population_consumers\": 54, \"training_time_reduction\": 35}',345600),(379,13,17,'{\"iron\": 550000, \"wood\": 500000, \"stone\": 400000, \"wheat\": 350000}','{\"defense_power\": 200000, \"troop_speed_boost\": 22, \"civilization_points\": 200, \"population_consumers\": 56, \"training_time_reduction\": 39}',388800),(380,13,18,'{\"iron\": 650000, \"wood\": 600000, \"stone\": 500000, \"wheat\": 400000}','{\"defense_power\": 230000, \"troop_speed_boost\": 24, \"civilization_points\": 205, \"population_consumers\": 60, \"training_time_reduction\": 40}',432000),(381,13,19,'{\"iron\": 800000, \"wood\": 700000, \"stone\": 600000, \"wheat\": 500000}','{\"defense_power\": 260000, \"troop_speed_boost\": 25, \"civilization_points\": 215, \"population_consumers\": 63, \"training_time_reduction\": 42}',576000),(382,13,20,'{\"iron\": 900000, \"wood\": 800000, \"stone\": 700000, \"wheat\": 600000}','{\"defense_power\": 300000, \"troop_speed_boost\": 26, \"civilization_points\": 220, \"population_consumers\": 67, \"training_time_reduction\": 44}',720000),(383,13,21,'{\"iron\": 1000000, \"wood\": 900000, \"stone\": 800000, \"wheat\": 700000}','{\"defense_power\": 340000, \"troop_speed_boost\": 27, \"civilization_points\": 225, \"population_consumers\": 71, \"training_time_reduction\": 45}',864000),(384,13,22,'{\"iron\": 1100000, \"wood\": 1000000, \"stone\": 900000, \"wheat\": 800000}','{\"defense_power\": 380000, \"troop_speed_boost\": 29, \"civilization_points\": 230, \"population_consumers\": 75, \"training_time_reduction\": 47}',1008000),(385,13,23,'{\"iron\": 1200000, \"wood\": 1100000, \"stone\": 1000000, \"wheat\": 900000}','{\"defense_power\": 450000, \"troop_speed_boost\": 30, \"civilization_points\": 240, \"population_consumers\": 77, \"training_time_reduction\": 48}',1209600),(386,13,24,'{\"iron\": 1400000, \"wood\": 1300000, \"stone\": 1200000, \"wheat\": 1000000}','{\"defense_power\": 520000, \"troop_speed_boost\": 31, \"civilization_points\": 245, \"population_consumers\": 80, \"training_time_reduction\": 50}',1382400),(387,13,25,'{\"iron\": 1600000, \"wood\": 1500000, \"stone\": 1400000, \"wheat\": 1200000}','{\"defense_power\": 600000, \"troop_speed_boost\": 32, \"civilization_points\": 250, \"population_consumers\": 83, \"training_time_reduction\": 55}',1555200),(388,13,26,'{\"iron\": 1800000, \"wood\": 1700000, \"stone\": 1600000, \"wheat\": 1400000}','{\"defense_power\": 700000, \"troop_speed_boost\": 35, \"civilization_points\": 255, \"population_consumers\": 86, \"training_time_reduction\": 58}',1728000),(389,13,27,'{\"iron\": 2000000, \"wood\": 1900000, \"stone\": 1800000, \"wheat\": 1600000}','{\"defense_power\": 800000, \"troop_speed_boost\": 37, \"civilization_points\": 260, \"population_consumers\": 90, \"training_time_reduction\": 62}',2073600),(390,13,28,'{\"iron\": 2200000, \"wood\": 2100000, \"stone\": 2000000, \"wheat\": 1800000}','{\"defense_power\": 900000, \"troop_speed_boost\": 39, \"civilization_points\": 270, \"population_consumers\": 94, \"training_time_reduction\": 65}',2592000),(391,13,29,'{\"iron\": 2400000, \"wood\": 2300000, \"stone\": 2200000, \"wheat\": 2000000}','{\"defense_power\": 1000000, \"troop_speed_boost\": 42, \"civilization_points\": 275, \"population_consumers\": 98, \"training_time_reduction\": 70}',3110400),(392,13,30,'{\"iron\": 3500000, \"wood\": 3000000, \"stone\": 2800000, \"wheat\": 2500000}','{\"defense_power\": 1200000, \"troop_speed_boost\": 45, \"civilization_points\": 290, \"population_consumers\": 98, \"training_time_reduction\": 80}',3888000),(393,14,1,'{\"iron\": 2500, \"wood\": 2000, \"stone\": 1500, \"wheat\": 1000}','{\"attack_limit\": 15, \"defense_power\": 8000, \"civilization_points\": 5, \"population_consumers\": 3}',600),(394,14,2,'{\"iron\": 3000, \"wood\": 2500, \"stone\": 2000, \"wheat\": 1500}','{\"attack_limit\": 20, \"defense_power\": 20000, \"civilization_points\": 10, \"population_consumers\": 5}',900),(395,14,3,'{\"iron\": 4000, \"wood\": 3500, \"stone\": 3000, \"wheat\": 2500}','{\"attack_limit\": 25, \"defense_power\": 32000, \"civilization_points\": 15, \"population_consumers\": 8}',1200),(396,14,4,'{\"iron\": 6000, \"wood\": 5000, \"stone\": 4000, \"wheat\": 3500}','{\"attack_limit\": 30, \"defense_power\": 45000, \"civilization_points\": 20, \"population_consumers\": 11}',6000),(397,14,5,'{\"iron\": 7000, \"wood\": 6000, \"stone\": 4500, \"wheat\": 4000}','{\"attack_limit\": 35, \"defense_power\": 58000, \"civilization_points\": 22, \"population_consumers\": 13}',14400),(398,14,6,'{\"iron\": 22000, \"wood\": 25000, \"stone\": 15000, \"wheat\": 10000}','{\"attack_limit\": 40, \"defense_power\": 70000, \"civilization_points\": 25, \"population_consumers\": 15}',29400),(399,14,7,'{\"iron\": 35000, \"wood\": 40000, \"stone\": 25000, \"wheat\": 20000}','{\"attack_limit\": 45, \"defense_power\": 90000, \"civilization_points\": 28, \"population_consumers\": 17}',61500),(400,14,8,'{\"iron\": 60000, \"wood\": 70000, \"stone\": 50000, \"wheat\": 40000}','{\"attack_limit\": 50, \"defense_power\": 110000, \"civilization_points\": 30, \"population_consumers\": 20}',94200),(401,14,9,'{\"iron\": 90000, \"wood\": 100000, \"stone\": 80000, \"wheat\": 65000}','{\"attack_limit\": 55, \"defense_power\": 130000, \"civilization_points\": 35, \"population_consumers\": 22}',717000),(402,14,10,'{\"iron\": 155000, \"wood\": 170000, \"stone\": 130000, \"wheat\": 100000}','{\"attack_limit\": 60, \"defense_power\": 150000, \"civilization_points\": 40, \"population_consumers\": 24}',86400),(403,14,11,'{\"iron\": 230000, \"wood\": 250000, \"stone\": 190000, \"wheat\": 150000}','{\"attack_limit\": 65, \"defense_power\": 170000, \"civilization_points\": 42, \"population_consumers\": 27}',172800),(404,14,12,'{\"iron\": 320000, \"wood\": 350000, \"stone\": 250000, \"wheat\": 200000}','{\"attack_limit\": 70, \"defense_power\": 190000, \"civilization_points\": 44, \"population_consumers\": 30}',259200),(405,14,13,'{\"iron\": 600000, \"wood\": 700000, \"stone\": 450000, \"wheat\": 350000}','{\"attack_limit\": 75, \"defense_power\": 210000, \"civilization_points\": 48, \"population_consumers\": 33}',345600),(406,14,14,'{\"iron\": 850000, \"wood\": 1000000, \"stone\": 650000, \"wheat\": 500000}','{\"attack_limit\": 80, \"defense_power\": 230000, \"civilization_points\": 50, \"population_consumers\": 35}',432000),(407,14,15,'{\"iron\": 1000000, \"wood\": 1100000, \"stone\": 900000, \"wheat\": 700000}','{\"attack_limit\": 85, \"defense_power\": 250000, \"civilization_points\": 60, \"population_consumers\": 38}',691200),(408,14,16,'{\"iron\": 1100000, \"wood\": 1200000, \"stone\": 1000000, \"wheat\": 1000000}','{\"attack_limit\": 90, \"defense_power\": 300000, \"civilization_points\": 80, \"population_consumers\": 41}',777600),(409,14,17,'{\"iron\": 1200000, \"wood\": 1400000, \"stone\": 1200000, \"wheat\": 1100000}','{\"attack_limit\": 95, \"defense_power\": 400000, \"civilization_points\": 90, \"population_consumers\": 44}',1036800),(410,14,18,'{\"iron\": 1400000, \"wood\": 1500000, \"stone\": 1300000, \"wheat\": 1200000}','{\"attack_limit\": 100, \"defense_power\": 500000, \"civilization_points\": 100, \"population_consumers\": 48}',1123200),(411,14,19,'{\"iron\": 1500000, \"wood\": 1700000, \"stone\": 1400000, \"wheat\": 1300000}','{\"attack_limit\": 105, \"defense_power\": 600000, \"civilization_points\": 110, \"population_consumers\": 52}',1209600),(412,14,20,'{\"iron\": 1700000, \"wood\": 2000000, \"stone\": 1500000, \"wheat\": 1500000}','{\"attack_limit\": 110, \"defense_power\": 700000, \"civilization_points\": 120, \"population_consumers\": 56}',1296000),(413,15,1,'{\"iron\": 2500, \"wood\": 2000, \"stone\": 1500, \"wheat\": 1000}','{\"member_limit\": 5, \"defense_power\": 8000, \"civilization_points\": 5, \"population_consumers\": 3}',600),(414,15,2,'{\"iron\": 3000, \"wood\": 2500, \"stone\": 2000, \"wheat\": 1500}','{\"member_limit\": 10, \"defense_power\": 20000, \"civilization_points\": 10, \"population_consumers\": 5}',900),(415,15,3,'{\"iron\": 4000, \"wood\": 3500, \"stone\": 3000, \"wheat\": 2500}','{\"member_limit\": 15, \"defense_power\": 32000, \"civilization_points\": 15, \"population_consumers\": 8}',1200),(416,15,4,'{\"iron\": 6000, \"wood\": 5000, \"stone\": 4000, \"wheat\": 3500}','{\"member_limit\": 20, \"defense_power\": 45000, \"civilization_points\": 20, \"population_consumers\": 11}',6000),(417,15,5,'{\"iron\": 7000, \"wood\": 6000, \"stone\": 4500, \"wheat\": 4000}','{\"member_limit\": 25, \"defense_power\": 58000, \"civilization_points\": 22, \"population_consumers\": 13}',14400),(418,15,6,'{\"iron\": 22000, \"wood\": 25000, \"stone\": 15000, \"wheat\": 10000}','{\"member_limit\": 30, \"defense_power\": 70000, \"civilization_points\": 25, \"population_consumers\": 15}',29700),(419,15,7,'{\"iron\": 35000, \"wood\": 40000, \"stone\": 25000, \"wheat\": 20000}','{\"member_limit\": 35, \"defense_power\": 90000, \"civilization_points\": 28, \"population_consumers\": 17}',61500),(420,15,8,'{\"iron\": 60000, \"wood\": 70000, \"stone\": 50000, \"wheat\": 40000}','{\"member_limit\": 40, \"defense_power\": 110000, \"civilization_points\": 30, \"population_consumers\": 20}',93600),(421,15,9,'{\"iron\": 90000, \"wood\": 100000, \"stone\": 80000, \"wheat\": 65000}','{\"member_limit\": 45, \"defense_power\": 130000, \"civilization_points\": 35, \"population_consumers\": 22}',117000),(422,15,10,'{\"iron\": 155000, \"wood\": 170000, \"stone\": 130000, \"wheat\": 100000}','{\"member_limit\": 50, \"defense_power\": 150000, \"civilization_points\": 40, \"population_consumers\": 24}',172800),(423,15,11,'{\"iron\": 230000, \"wood\": 250000, \"stone\": 190000, \"wheat\": 150000}','{\"member_limit\": 55, \"defense_power\": 170000, \"civilization_points\": 42, \"population_consumers\": 27}',216000),(424,15,12,'{\"iron\": 320000, \"wood\": 350000, \"stone\": 250000, \"wheat\": 200000}','{\"member_limit\": 60, \"defense_power\": 190000, \"civilization_points\": 44, \"population_consumers\": 29}',283200),(425,15,13,'{\"iron\": 450000, \"wood\": 500000, \"stone\": 350000, \"wheat\": 250000}','{\"member_limit\": 65, \"defense_power\": 210000, \"civilization_points\": 48, \"population_consumers\": 32}',259200),(426,15,14,'{\"iron\": 550000, \"wood\": 650000, \"stone\": 450000, \"wheat\": 300000}','{\"member_limit\": 70, \"defense_power\": 230000, \"civilization_points\": 50, \"population_consumers\": 34}',438000),(427,15,15,'{\"iron\": 600000, \"wood\": 750000, \"stone\": 500000, \"wheat\": 400000}','{\"member_limit\": 75, \"defense_power\": 250000, \"civilization_points\": 60, \"population_consumers\": 37}',864000),(428,15,16,'{\"iron\": 700000, \"wood\": 900000, \"stone\": 550000, \"wheat\": 450000}','{\"member_limit\": 80, \"defense_power\": 300000, \"civilization_points\": 80, \"population_consumers\": 40}',1296000),(429,15,17,'{\"iron\": 900000, \"wood\": 1000000, \"stone\": 650000, \"wheat\": 570000}','{\"member_limit\": 85, \"defense_power\": 400000, \"civilization_points\": 90, \"population_consumers\": 43}',1296000),(430,15,18,'{\"iron\": 1000000, \"wood\": 1200000, \"stone\": 750000, \"wheat\": 650000}','{\"member_limit\": 90, \"defense_power\": 500000, \"civilization_points\": 100, \"population_consumers\": 47}',1728000),(431,15,19,'{\"iron\": 1100000, \"wood\": 1300000, \"stone\": 800000, \"wheat\": 700000}','{\"member_limit\": 95, \"defense_power\": 600000, \"civilization_points\": 110, \"population_consumers\": 51}',2160000),(432,15,20,'{\"iron\": 1200000, \"wood\": 1500000, \"stone\": 1000000, \"wheat\": 800000}','{\"member_limit\": 100, \"defense_power\": 700000, \"civilization_points\": 120, \"population_consumers\": 55}',8640000),(433,20,1,'{\"iron\": 5000, \"wood\": 5000, \"stone\": 5000, \"wheat\": 5000}','{\"defense_power\": 8000, \"civilization_points\": 5, \"population_consumers\": 3, \"updating_time_reduction\": 0}',3600),(434,20,2,'{\"iron\": 15000, \"wood\": 15000, \"stone\": 15000, \"wheat\": 15000}','{\"defense_power\": 20000, \"civilization_points\": 10, \"population_consumers\": 5, \"updating_time_reduction\": 1}',10800),(435,20,3,'{\"iron\": 25000, \"wood\": 25000, \"stone\": 25000, \"wheat\": 25000}','{\"defense_power\": 32000, \"civilization_points\": 15, \"population_consumers\": 8, \"updating_time_reduction\": 2}',21600),(436,20,4,'{\"iron\": 55000, \"wood\": 55000, \"stone\": 55000, \"wheat\": 55000}','{\"defense_power\": 45000, \"civilization_points\": 20, \"population_consumers\": 11, \"updating_time_reduction\": 4}',43200),(437,20,5,'{\"iron\": 80000, \"wood\": 80000, \"stone\": 80000, \"wheat\": 80000}','{\"defense_power\": 58000, \"civilization_points\": 22, \"population_consumers\": 13, \"updating_time_reduction\": 5}',79200),(438,20,6,'{\"iron\": 130000, \"wood\": 130000, \"stone\": 130000, \"wheat\": 130000}','{\"defense_power\": 70000, \"civilization_points\": 25, \"population_consumers\": 15, \"updating_time_reduction\": 6}',108000),(439,20,7,'{\"iron\": 180000, \"wood\": 180000, \"stone\": 180000, \"wheat\": 180000}','{\"defense_power\": 90000, \"civilization_points\": 28, \"population_consumers\": 17, \"updating_time_reduction\": 8}',126000),(440,20,8,'{\"iron\": 250000, \"wood\": 250000, \"stone\": 250000, \"wheat\": 250000}','{\"defense_power\": 110000, \"civilization_points\": 30, \"population_consumers\": 20, \"updating_time_reduction\": 9}',360000),(441,20,9,'{\"iron\": 400000, \"wood\": 400000, \"stone\": 400000, \"wheat\": 400000}','{\"defense_power\": 130000, \"civilization_points\": 35, \"population_consumers\": 22, \"updating_time_reduction\": 10}',684000),(442,20,10,'{\"iron\": 600000, \"wood\": 600000, \"stone\": 600000, \"wheat\": 600000}','{\"defense_power\": 150000, \"civilization_points\": 40, \"population_consumers\": 24, \"updating_time_reduction\": 12}',172800),(443,20,11,'{\"iron\": 600000, \"wood\": 600000, \"stone\": 600000, \"wheat\": 600000}','{\"defense_power\": 170000, \"civilization_points\": 42, \"population_consumers\": 27, \"updating_time_reduction\": 14}',216000),(444,20,12,'{\"iron\": 750000, \"wood\": 750000, \"stone\": 750000, \"wheat\": 750000}','{\"defense_power\": 190000, \"civilization_points\": 44, \"population_consumers\": 29, \"updating_time_reduction\": 16}',259200),(445,20,13,'{\"iron\": 800000, \"wood\": 800000, \"stone\": 800000, \"wheat\": 800000}','{\"defense_power\": 210000, \"civilization_points\": 48, \"population_consumers\": 32, \"updating_time_reduction\": 17}',259200),(446,20,14,'{\"iron\": 850000, \"wood\": 850000, \"stone\": 850000, \"wheat\": 850000}','{\"defense_power\": 230000, \"civilization_points\": 50, \"population_consumers\": 34, \"updating_time_reduction\": 19}',438000),(447,20,15,'{\"iron\": 900000, \"wood\": 900000, \"stone\": 900000, \"wheat\": 900000}','{\"defense_power\": 250000, \"civilization_points\": 60, \"population_consumers\": 37, \"updating_time_reduction\": 20}',432000),(448,20,16,'{\"iron\": 1000000, \"wood\": 1000000, \"stone\": 1000000, \"wheat\": 1000000}','{\"defense_power\": 300000, \"civilization_points\": 80, \"population_consumers\": 40, \"updating_time_reduction\": 22}',432000),(449,20,17,'{\"iron\": 1000000, \"wood\": 1000000, \"stone\": 1000000, \"wheat\": 1000000}','{\"defense_power\": 400000, \"civilization_points\": 90, \"population_consumers\": 43, \"updating_time_reduction\": 24}',432000),(450,20,18,'{\"iron\": 1100000, \"wood\": 1100000, \"stone\": 1100000, \"wheat\": 1100000}','{\"defense_power\": 500000, \"civilization_points\": 100, \"population_consumers\": 47, \"updating_time_reduction\": 26}',432000),(451,20,19,'{\"iron\": 1200000, \"wood\": 1200000, \"stone\": 1200000, \"wheat\": 1200000}','{\"defense_power\": 600000, \"civilization_points\": 110, \"population_consumers\": 51, \"updating_time_reduction\": 30}',432000),(452,20,20,'{\"iron\": 1500000, \"wood\": 1500000, \"stone\": 1500000, \"wheat\": 1500000}','{\"defense_power\": 700000, \"civilization_points\": 120, \"population_consumers\": 55, \"updating_time_reduction\": 35}',432000),(453,21,1,'{\"iron\": 400000, \"wood\": 400000, \"stone\": 400000, \"wheat\": 400000}','{\"defense_power\": 100000, \"civilization_points\": 10, \"ballon_destroy_point\": 3000, \"population_consumers\": 6}',172800),(454,21,2,'{\"iron\": 700000, \"wood\": 700000, \"stone\": 700000, \"wheat\": 700000}','{\"defense_power\": 200000, \"civilization_points\": 25, \"ballon_destroy_point\": 20000, \"population_consumers\": 12}',432000),(455,21,3,'{\"iron\": 1000000, \"wood\": 1000000, \"stone\": 1000000, \"wheat\": 1000000}','{\"defense_power\": 400000, \"civilization_points\": 55, \"ballon_destroy_point\": 30000, \"population_consumers\": 18}',604800),(456,21,4,'{\"iron\": 2000000, \"wood\": 2000000, \"stone\": 2000000, \"wheat\": 2000000}','{\"defense_power\": 600000, \"civilization_points\": 70, \"ballon_destroy_point\": 50000, \"population_consumers\": 24}',864000),(457,21,5,'{\"iron\": 3500000, \"wood\": 3500000, \"stone\": 3500000, \"wheat\": 3500000}','{\"defense_power\": 800000, \"civilization_points\": 150, \"ballon_destroy_point\": 100000, \"population_consumers\": 30}',1296000),(458,22,1,'{\"iron\": 5000, \"wood\": 5000, \"stone\": 5000, \"wheat\": 5000}','{\"defense_power\": 8000, \"civilization_points\": 5, \"population_consumers\": 3}',600),(459,22,2,'{\"iron\": 15000, \"wood\": 15000, \"stone\": 15000, \"wheat\": 15000}','{\"defense_power\": 20000, \"civilization_points\": 10, \"population_consumers\": 5}',900),(460,22,3,'{\"iron\": 25000, \"wood\": 25000, \"stone\": 25000, \"wheat\": 25000}','{\"defense_power\": 32000, \"civilization_points\": 15, \"population_consumers\": 8}',1200),(461,22,4,'{\"iron\": 55000, \"wood\": 55000, \"stone\": 55000, \"wheat\": 55000}','{\"defense_power\": 45000, \"civilization_points\": 20, \"population_consumers\": 11}',6000),(462,22,5,'{\"iron\": 80000, \"wood\": 80000, \"stone\": 80000, \"wheat\": 80000}','{\"defense_power\": 58000, \"civilization_points\": 22, \"population_consumers\": 13}',14400),(463,22,6,'{\"iron\": 130000, \"wood\": 130000, \"stone\": 130000, \"wheat\": 130000}','{\"defense_power\": 70000, \"civilization_points\": 25, \"population_consumers\": 15}',29400),(464,22,7,'{\"iron\": 180000, \"wood\": 180000, \"stone\": 180000, \"wheat\": 180000}','{\"defense_power\": 90000, \"civilization_points\": 28, \"population_consumers\": 17}',61500),(465,22,8,'{\"iron\": 250000, \"wood\": 250000, \"stone\": 250000, \"wheat\": 250000}','{\"defense_power\": 110000, \"civilization_points\": 30, \"population_consumers\": 20}',94200),(466,22,9,'{\"iron\": 350000, \"wood\": 350000, \"stone\": 350000, \"wheat\": 350000}','{\"defense_power\": 130000, \"civilization_points\": 35, \"population_consumers\": 22}',71700),(467,22,10,'{\"iron\": 500000, \"wood\": 500000, \"stone\": 500000, \"wheat\": 500000}','{\"defense_power\": 150000, \"civilization_points\": 40, \"population_consumers\": 24}',79200),(468,22,11,'{\"iron\": 600000, \"wood\": 600000, \"stone\": 600000, \"wheat\": 600000}','{\"defense_power\": 170000, \"civilization_points\": 42, \"population_consumers\": 27}',216000),(469,22,12,'{\"iron\": 750000, \"wood\": 750000, \"stone\": 750000, \"wheat\": 750000}','{\"defense_power\": 190000, \"civilization_points\": 44, \"population_consumers\": 29}',239200),(470,22,13,'{\"iron\": 800000, \"wood\": 800000, \"stone\": 800000, \"wheat\": 800000}','{\"defense_power\": 210000, \"civilization_points\": 48, \"population_consumers\": 32}',291000),(471,22,14,'{\"iron\": 850000, \"wood\": 850000, \"stone\": 850000, \"wheat\": 850000}','{\"defense_power\": 230000, \"civilization_points\": 50, \"population_consumers\": 34}',291000),(472,22,15,'{\"iron\": 900000, \"wood\": 900000, \"stone\": 900000, \"wheat\": 900000}','{\"defense_power\": 250000, \"civilization_points\": 60, \"population_consumers\": 37}',277200),(473,22,16,'{\"iron\": 1000000, \"wood\": 1000000, \"stone\": 1000000, \"wheat\": 1000000}','{\"defense_power\": 300000, \"civilization_points\": 80, \"population_consumers\": 40}',302400),(474,22,17,'{\"iron\": 1000000, \"wood\": 1000000, \"stone\": 1000000, \"wheat\": 1000000}','{\"defense_power\": 400000, \"civilization_points\": 90, \"population_consumers\": 43}',414000),(475,22,18,'{\"iron\": 1100000, \"wood\": 1100000, \"stone\": 1100000, \"wheat\": 1100000}','{\"defense_power\": 500000, \"civilization_points\": 100, \"population_consumers\": 47}',691200),(476,22,19,'{\"iron\": 1200000, \"wood\": 1200000, \"stone\": 1200000, \"wheat\": 1200000}','{\"defense_power\": 600000, \"civilization_points\": 110, \"population_consumers\": 51}',691200),(477,22,20,'{\"iron\": 1500000, \"wood\": 1500000, \"stone\": 1500000, \"wheat\": 1500000}','{\"defense_power\": 700000, \"civilization_points\": 120, \"population_consumers\": 55}',691200),(478,23,1,'{\"iron\": 5000, \"wood\": 5000, \"stone\": 5000, \"wheat\": 5000}','{\"defense_power\": 8000, \"civilization_points\": 5, \"population_consumers\": 3}',600),(479,23,2,'{\"iron\": 15000, \"wood\": 15000, \"stone\": 15000, \"wheat\": 15000}','{\"defense_power\": 20000, \"civilization_points\": 10, \"population_consumers\": 5}',900),(480,23,3,'{\"iron\": 25000, \"wood\": 25000, \"stone\": 25000, \"wheat\": 25000}','{\"defense_power\": 32000, \"civilization_points\": 15, \"population_consumers\": 8}',1200),(481,23,4,'{\"iron\": 55000, \"wood\": 55000, \"stone\": 55000, \"wheat\": 55000}','{\"defense_power\": 45000, \"civilization_points\": 20, \"population_consumers\": 11}',6000),(482,23,5,'{\"iron\": 80000, \"wood\": 80000, \"stone\": 80000, \"wheat\": 80000}','{\"defense_power\": 58000, \"civilization_points\": 22, \"population_consumers\": 13}',14400),(483,23,6,'{\"iron\": 130000, \"wood\": 130000, \"stone\": 130000, \"wheat\": 130000}','{\"defense_power\": 70000, \"civilization_points\": 25, \"population_consumers\": 15}',29400),(484,23,7,'{\"iron\": 180000, \"wood\": 180000, \"stone\": 180000, \"wheat\": 180000}','{\"defense_power\": 90000, \"civilization_points\": 28, \"population_consumers\": 17}',61500),(485,23,8,'{\"iron\": 250000, \"wood\": 250000, \"stone\": 250000, \"wheat\": 250000}','{\"defense_power\": 110000, \"civilization_points\": 30, \"population_consumers\": 20}',94200),(486,23,9,'{\"iron\": 350000, \"wood\": 350000, \"stone\": 350000, \"wheat\": 350000}','{\"defense_power\": 130000, \"civilization_points\": 35, \"population_consumers\": 22}',117000),(487,23,10,'{\"iron\": 500000, \"wood\": 500000, \"stone\": 500000, \"wheat\": 500000}','{\"defense_power\": 150000, \"civilization_points\": 40, \"population_consumers\": 24}',79200),(488,23,11,'{\"iron\": 600000, \"wood\": 600000, \"stone\": 600000, \"wheat\": 600000}','{\"defense_power\": 170000, \"civilization_points\": 42, \"population_consumers\": 27}',216000),(489,23,12,'{\"iron\": 750000, \"wood\": 750000, \"stone\": 750000, \"wheat\": 750000}','{\"defense_power\": 190000, \"civilization_points\": 44, \"population_consumers\": 29}',474000),(490,23,13,'{\"iron\": 800000, \"wood\": 800000, \"stone\": 800000, \"wheat\": 800000}','{\"defense_power\": 210000, \"civilization_points\": 48, \"population_consumers\": 32}',265200),(491,23,14,'{\"iron\": 850000, \"wood\": 850000, \"stone\": 850000, \"wheat\": 850000}','{\"defense_power\": 230000, \"civilization_points\": 50, \"population_consumers\": 34}',291000),(492,23,15,'{\"iron\": 900000, \"wood\": 900000, \"stone\": 900000, \"wheat\": 900000}','{\"defense_power\": 250000, \"civilization_points\": 60, \"population_consumers\": 37}',324000),(493,23,16,'{\"iron\": 1000000, \"wood\": 1000000, \"stone\": 1000000, \"wheat\": 1000000}','{\"defense_power\": 300000, \"civilization_points\": 80, \"population_consumers\": 40}',432000),(494,23,17,'{\"iron\": 1000000, \"wood\": 1000000, \"stone\": 1000000, \"wheat\": 1000000}','{\"defense_power\": 400000, \"civilization_points\": 90, \"population_consumers\": 43}',432000),(495,23,18,'{\"iron\": 1100000, \"wood\": 1100000, \"stone\": 1100000, \"wheat\": 1100000}','{\"defense_power\": 500000, \"civilization_points\": 100, \"population_consumers\": 47}',864000),(496,23,19,'{\"iron\": 1200000, \"wood\": 1200000, \"stone\": 1200000, \"wheat\": 1200000}','{\"defense_power\": 600000, \"civilization_points\": 110, \"population_consumers\": 51}',864000),(497,23,20,'{\"iron\": 1500000, \"wood\": 1500000, \"stone\": 1500000, \"wheat\": 1500000}','{\"defense_power\": 700000, \"civilization_points\": 120, \"population_consumers\": 55}',864000),(498,24,1,'{\"iron\": 5000, \"wood\": 5000, \"stone\": 5000, \"wheat\": 5000}','{\"defense_power\": 8000, \"civilization_points\": 5, \"population_consumers\": 3}',600),(499,24,2,'{\"iron\": 15000, \"wood\": 15000, \"stone\": 15000, \"wheat\": 15000}','{\"defense_power\": 20000, \"civilization_points\": 10, \"population_consumers\": 5}',900),(500,24,3,'{\"iron\": 25000, \"wood\": 25000, \"stone\": 25000, \"wheat\": 25000}','{\"defense_power\": 32000, \"civilization_points\": 15, \"population_consumers\": 8}',1200),(501,24,4,'{\"iron\": 55000, \"wood\": 55000, \"stone\": 55000, \"wheat\": 55000}','{\"defense_power\": 45000, \"civilization_points\": 20, \"population_consumers\": 11}',6000),(502,24,5,'{\"iron\": 80000, \"wood\": 80000, \"stone\": 80000, \"wheat\": 80000}','{\"defense_power\": 58000, \"civilization_points\": 22, \"population_consumers\": 13}',14400),(503,24,6,'{\"iron\": 130000, \"wood\": 130000, \"stone\": 130000, \"wheat\": 130000}','{\"defense_power\": 70000, \"civilization_points\": 25, \"population_consumers\": 15}',29400),(504,24,7,'{\"iron\": 180000, \"wood\": 180000, \"stone\": 180000, \"wheat\": 180000}','{\"defense_power\": 90000, \"civilization_points\": 28, \"population_consumers\": 17}',61500),(505,24,8,'{\"iron\": 250000, \"wood\": 250000, \"stone\": 250000, \"wheat\": 250000}','{\"defense_power\": 110000, \"civilization_points\": 30, \"population_consumers\": 20}',94200),(506,24,9,'{\"iron\": 350000, \"wood\": 350000, \"stone\": 350000, \"wheat\": 350000}','{\"defense_power\": 130000, \"civilization_points\": 35, \"population_consumers\": 22}',117000),(507,24,10,'{\"iron\": 500000, \"wood\": 500000, \"stone\": 500000, \"wheat\": 500000}','{\"defense_power\": 150000, \"civilization_points\": 40, \"population_consumers\": 24}',79200),(508,24,11,'{\"iron\": 600000, \"wood\": 600000, \"stone\": 600000, \"wheat\": 600000}','{\"defense_power\": 170000, \"civilization_points\": 42, \"population_consumers\": 27}',216000),(509,24,12,'{\"iron\": 750000, \"wood\": 750000, \"stone\": 750000, \"wheat\": 750000}','{\"defense_power\": 190000, \"civilization_points\": 44, \"population_consumers\": 29}',474000),(510,24,13,'{\"iron\": 800000, \"wood\": 800000, \"stone\": 800000, \"wheat\": 800000}','{\"defense_power\": 210000, \"civilization_points\": 48, \"population_consumers\": 32}',265200),(511,24,14,'{\"iron\": 850000, \"wood\": 850000, \"stone\": 850000, \"wheat\": 850000}','{\"defense_power\": 230000, \"civilization_points\": 50, \"population_consumers\": 34}',291000),(512,24,15,'{\"iron\": 900000, \"wood\": 900000, \"stone\": 900000, \"wheat\": 900000}','{\"defense_power\": 250000, \"civilization_points\": 60, \"population_consumers\": 37}',324000),(513,24,16,'{\"iron\": 1000000, \"wood\": 1000000, \"stone\": 1000000, \"wheat\": 1000000}','{\"defense_power\": 300000, \"civilization_points\": 80, \"population_consumers\": 40}',432000),(514,24,17,'{\"iron\": 1000000, \"wood\": 1000000, \"stone\": 1000000, \"wheat\": 1000000}','{\"defense_power\": 400000, \"civilization_points\": 90, \"population_consumers\": 43}',432000),(515,24,18,'{\"iron\": 1100000, \"wood\": 1100000, \"stone\": 1100000, \"wheat\": 1100000}','{\"defense_power\": 500000, \"civilization_points\": 100, \"population_consumers\": 47}',864000),(516,24,19,'{\"iron\": 1200000, \"wood\": 1200000, \"stone\": 1200000, \"wheat\": 1200000}','{\"defense_power\": 600000, \"civilization_points\": 110, \"population_consumers\": 51}',864000),(517,24,20,'{\"iron\": 1500000, \"wood\": 1500000, \"stone\": 1500000, \"wheat\": 1500000}','{\"defense_power\": 700000, \"civilization_points\": 120, \"population_consumers\": 55}',864000);
/*!40000 ALTER TABLE `buildinglevels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buildings`
--

DROP TABLE IF EXISTS `buildings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buildings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  `max_level` int NOT NULL,
  `base_cost` json DEFAULT NULL,
  `base_stats` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buildings`
--

LOCK TABLES `buildings` WRITE;
/*!40000 ALTER TABLE `buildings` DISABLE KEYS */;
INSERT INTO `buildings` VALUES (1,'Town Hall','Main building to manage your civilization',30,'{\"iron\": 0, \"wood\": 0, \"stone\": 0, \"wheat\": 0}','{\"civilization_points\": 190, \"build_time_reduction\": 50, \"population_consumers\": 66}'),(2,'Farm','Building for producing wheat and managing agricultural resources',30,'{\"iron\": 0, \"wood\": 0, \"stone\": 0, \"wheat\": 0}','{\"wheat_production\": 951000, \"civilization_points\": 140, \"population_consumers\": 68}'),(3,'Quarry','Building for producing stone and managing mining resources',30,'{\"iron\": 0, \"wood\": 0, \"stone\": 0, \"wheat\": 0}','{\"stone_production\": 44000, \"civilization_points\": 160, \"population_consumers\": 74}'),(4,'Lumber Camp','Building for producing wood and managing forestry resources',30,'{\"iron\": 0, \"wood\": 0, \"stone\": 0, \"wheat\": 0}','{\"wood_production\": 45000, \"civilization_points\": 160, \"population_consumers\": 87}'),(5,'Iron Mine','Building for producing iron and managing mining resources',30,'{\"iron\": 0, \"wood\": 0, \"stone\": 0, \"wheat\": 0}','{\"iron_production\": 40000, \"civilization_points\": 220, \"population_consumers\": 61}'),(6,'Elixir Mine','Building for producing elixir and managing elixir resources',15,'{\"iron\": 150000, \"wood\": 150000, \"stone\": 150000, \"wheat\": 150000}','{\"defense_power\": 400000, \"elixir_production\": 1320, \"civilization_points\": 60, \"population_consumers\": 48}'),(7,'Store','Building for storing resources and managing inventory',30,'{\"iron\": 250, \"wood\": 250, \"stone\": 150, \"wheat\": 50}','{\"defense_power\": 900000, \"storage_capacity\": 10000000, \"civilization_points\": 190, \"population_consumers\": 81}'),(8,'Wall','Defensive structure to protect the settlement and enhance security.',20,'{\"iron\": 250, \"wood\": 250, \"stone\": 250, \"wheat\": 250}','{\"defense_power\": 400000, \"civilization_points\": 80, \"population_consumers\": 60, \"defense_power_increase_percent\": 40}'),(9,'Bakery','Facility for producing and storing food resources, contributing to the settlement’s prosperity.',10,'{\"iron\": 250000, \"wood\": 250000, \"stone\": 250000, \"wheat\": 100000}','{\"defense_power\": 300000, \"civilization_points\": 40, \"population_consumers\": 33, \"defense_power_increase_percent\": 70}'),(10,'Academy','Building for advancing research and enhancing troop training capabilities.',20,'{\"iron\": 2500, \"wood\": 2000, \"stone\": 1500, \"wheat\": 1000}','{\"defense_power\": 700000, \"civilization_points\": 120, \"population_consumers\": 64, \"training_time_reduction_percent\": 35}'),(11,'Barracks','Building for training and upgrading troops.',30,'{\"iron\": 1200, \"wood\": 2000, \"stone\": 1500, \"wheat\": 800}','{\"defense_power\": 900000, \"troop_speed_boost\": 45, \"civilization_points\": 300, \"population_consumers\": 98, \"training_time_reduction\": 80}'),(12,'Cavalry Training Ground','Facility for training and upgrading cavalry units.',20,'{\"iron\": 2500, \"wood\": 1500, \"stone\": 2000, \"wheat\": 1000}','{\"defense_power\": 1200000, \"troop_speed_boost\": 45, \"civilization_points\": 290, \"population_consumers\": 98, \"training_time_reduction\": 80}'),(13,'Workshop','Building for training and upgrading troops.',30,'{\"iron\": 2500, \"wood\": 1500, \"stone\": 2000, \"wheat\": 1000}','{\"defense_power\": 1200000, \"troop_speed_boost\": 45, \"civilization_points\": 290, \"population_consumers\": 98, \"training_time_reduction\": 80}'),(14,'Army Camp','A camp that trains and houses military forces. Enhances defense and attack capabilities.',20,'{\"iron\": 2500, \"wood\": 2000, \"stone\": 1500, \"wheat\": 1000}','{\"attack_limit\": 110, \"defense_power\": 700000, \"civilization_points\": 120, \"population_consumers\": 56}'),(15,'Alliance','A cooperative structure that allows players to form alliances for mutual benefit and defense.',20,'{\"iron\": 2500, \"wood\": 2000, \"stone\": 1500, \"wheat\": 1000}','{\"member_limit\": 100, \"defense_power\": 700000, \"civilization_points\": 120, \"population_consumers\": 55}'),(20,'Castle','A stronghold for defense and civilization development. Increases defense power and civilization benefits at each level.',20,'{\"iron\": 5000, \"wood\": 5000, \"stone\": 5000, \"wheat\": 5000}','{\"defense_power\": 700000, \"civilization_points\": 120, \"population_consumers\": 55, \"updating_time_reduction\": 35}'),(21,'Air Defense','A defensive structure designed to protect against aerial attacks. It enhances defense capabilities against air units and increases civilization benefits.',5,'{\"iron\": 400000, \"wood\": 400000, \"stone\": 400000, \"wheat\": 400000}','{\"defense_power\": 800000, \"civilization_points\": 150, \"ballon_destroy_point\": 100000, \"population_consumers\": 30}'),(22,'Treasury','A vital building for resource management that increases defense capabilities and civilization benefits.',20,'{\"iron\": 5000, \"wood\": 5000, \"stone\": 5000, \"wheat\": 5000}','{\"defense_power\": 700000, \"civilization_points\": 120, \"population_consumers\": 55}'),(23,'Mansion','An impressive building that enhances defense and contributes to civilization development.',20,'{\"iron\": 5000, \"wood\": 5000, \"stone\": 5000, \"wheat\": 5000}','{\"defense_power\": 700000, \"civilization_points\": 120, \"population_consumers\": 55}'),(24,'Shop','A building that allows for resource trading and enhances defense against attacks.',20,'{\"iron\": 5000, \"wood\": 5000, \"stone\": 5000, \"wheat\": 5000}','{\"defense_power\": 700000, \"civilization_points\": 120, \"population_consumers\": 55}');
/*!40000 ALTER TABLE `buildings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buildingupgrades`
--

DROP TABLE IF EXISTS `buildingupgrades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buildingupgrades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `playerToken` varchar(255) DEFAULT NULL,
  `buildingID` int DEFAULT NULL,
  `startTime` datetime DEFAULT NULL,
  `endTime` datetime DEFAULT NULL,
  `completed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=429 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buildingupgrades`
--

LOCK TABLES `buildingupgrades` WRITE;
/*!40000 ALTER TABLE `buildingupgrades` DISABLE KEYS */;
/*!40000 ALTER TABLE `buildingupgrades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clans`
--

DROP TABLE IF EXISTS `clans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `leader_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `recivedRequests` varchar(255) DEFAULT NULL,
  `avatarCode` int DEFAULT NULL,
  `clanCup` int DEFAULT '1000',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=94814 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clans`
--

LOCK TABLES `clans` WRITE;
/*!40000 ALTER TABLE `clans` DISABLE KEYS */;
/*!40000 ALTER TABLE `clans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contracts`
--

DROP TABLE IF EXISTS `contracts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contracts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contractName` varchar(255) NOT NULL,
  `value` json NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `contractName` (`contractName`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contracts`
--

LOCK TABLES `contracts` WRITE;
/*!40000 ALTER TABLE `contracts` DISABLE KEYS */;
INSERT INTO `contracts` VALUES (2,'100GEM','{\"Gem\": 100, \"price\": 0.99}'),(3,'500GEM','{\"Gem\": 550, \"price\": 4.99}'),(4,'1200GEM','{\"Gem\": 1200, \"price\": 9.99}'),(5,'2600GEM','{\"Gem\": 2600, \"price\": 19.99}'),(6,'7000GEM','{\"Gem\": 7000, \"price\": 49.99}'),(7,'15000GEM','{\"Gem\": 15000, \"price\": 99.99}'),(8,'100REWARD','{\"Gem\": 100}'),(9,'200REWARD','{\"Gem\": 200}'),(10,'400REWARD','{\"Gem\": 400}'),(11,'600REWARD','{\"Gem\": 600}');
/*!40000 ALTER TABLE `contracts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forcecreation`
--

DROP TABLE IF EXISTS `forcecreation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forcecreation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `player_id` int NOT NULL,
  `force_type` varchar(50) NOT NULL,
  `amount` int NOT NULL,
  `required_iron` int NOT NULL,
  `required_stone` int NOT NULL,
  `required_wood` int NOT NULL,
  `required_wheat` int NOT NULL,
  `creation_start_time` datetime NOT NULL,
  `creation_end_time` datetime NOT NULL,
  `status` enum('in_progress','completed') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forcecreation`
--

LOCK TABLES `forcecreation` WRITE;
/*!40000 ALTER TABLE `forcecreation` DISABLE KEYS */;
/*!40000 ALTER TABLE `forcecreation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forces`
--

DROP TABLE IF EXISTS `forces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forces` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `level` int NOT NULL,
  `attack_power` int NOT NULL,
  `defense_power` int NOT NULL,
  `raid_capacity` int NOT NULL,
  `speed` int NOT NULL,
  `hp` int NOT NULL,
  `wheat_cost` varchar(10) NOT NULL,
  `wood_cost` varchar(10) NOT NULL,
  `iron_cost` varchar(10) NOT NULL,
  `elixir_cost` int NOT NULL DEFAULT '0',
  `upgrade_time` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=203 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forces`
--

LOCK TABLES `forces` WRITE;
/*!40000 ALTER TABLE `forces` DISABLE KEYS */;
INSERT INTO `forces` VALUES (1,'Infantry',1,19,50,50,60,140,'5000','5000','5000',0,'5m'),(2,'Infantry',2,20,51,51,61,150,'10000','10000','10000',0,'15m'),(3,'Infantry',3,21,52,52,62,155,'15000','15000','15000',0,'25m'),(4,'Infantry',4,22,54,53,63,165,'35000','35000','35000',0,'40m'),(5,'Infantry',5,23,55,55,65,175,'60000','60000','60000',0,'1h10m'),(6,'Infantry',6,24,57,58,67,180,'130000','130000','130000',0,'3h'),(7,'Infantry',7,25,58,60,68,185,'150000','150000','150000',0,'5h20m'),(8,'Infantry',8,26,60,61,70,195,'250000','250000','250000',0,'10h'),(9,'Infantry',9,27,62,62,72,200,'300000','300000','300000',0,'13h'),(10,'Infantry',10,28,65,65,75,215,'400000','400000','400000',0,'15h'),(11,'Infantry',11,29,67,68,78,220,'450000','450000','450000',0,'1d'),(12,'Infantry',12,30,69,72,80,230,'550000','550000','550000',0,'1d12h'),(13,'Infantry',13,31,80,75,85,250,'600000','600000','600000',0,'1d22h'),(14,'Infantry',14,32,95,80,86,255,'650000','650000','650000',0,'2d'),(15,'Infantry',15,33,105,85,87,260,'700000','700000','700000',0,'2d10h'),(16,'Infantry',16,35,120,86,88,265,'1000000','1000000','1000000',0,'2d23h'),(17,'Infantry',17,38,145,88,90,270,'1000000','1000000','1000000',0,'3d'),(18,'Infantry',18,40,160,90,92,280,'1100000','1100000','1100000',0,'3d5h'),(19,'Infantry',19,45,175,95,93,290,'1200000','1200000','1200000',0,'3d12h'),(20,'Infantry',20,50,190,100,95,310,'1500000','1500000','1500000',0,'3d20h'),(21,'Swordsman',1,70,35,50,70,105,'5000','5000','5000',0,'30m'),(22,'Swordsman',2,71,36,51,76,110,'15000','15000','15000',0,'1h'),(23,'Swordsman',3,72,36,52,77,115,'25000','25000','25000',0,'1h15m'),(24,'Swordsman',4,73,37,53,79,125,'55000','55000','55000',0,'2h30m'),(25,'Swordsman',5,73,37,55,80,130,'80000','80000','80000',0,'3h20m'),(26,'Swordsman',6,74,38,58,82,140,'130000','130000','130000',0,'4h50m'),(27,'Swordsman',7,74,39,60,83,145,'180000','180000','180000',0,'6h'),(28,'Swordsman',8,75,40,61,85,150,'250000','250000','250000',0,'10h'),(29,'Swordsman',9,76,41,62,87,160,'400000','400000','400000',0,'15h'),(30,'Swordsman',10,76,41,65,88,165,'600000','600000','600000',0,'18h'),(31,'Swordsman',11,77,42,68,90,175,'600000','600000','600000',0,'1d'),(32,'Swordsman',12,77,43,72,92,182,'750000','750000','750000',0,'1d5h'),(33,'Swordsman',13,78,44,75,95,185,'800000','800000','800000',0,'1d6h'),(34,'Swordsman',14,79,45,80,98,195,'850000','850000','850000',0,'1d15h'),(35,'Swordsman',15,80,46,85,100,210,'900000','900000','900000',0,'2d'),(36,'Swordsman',16,81,46,86,101,215,'1000000','1000000','1000000',0,'2d10h'),(37,'Swordsman',17,82,47,88,103,225,'1000000','1000000','1000000',0,'2d18h'),(38,'Swordsman',18,83,48,90,104,230,'1100000','1100000','1100000',0,'2d22h'),(39,'Swordsman',19,85,50,95,108,240,'1200000','1200000','1200000',0,'3d'),(40,'Swordsman',20,90,55,100,110,260,'1500000','1500000','1500000',0,'3d12h'),(41,'Maceman',1,85,35,45,60,140,'10000','15000','15000',0,'1h30m'),(42,'Maceman',2,86,37,46,61,150,'15000','25000','25000',0,'3h'),(43,'Maceman',3,87,38,47,62,155,'35000','45000','45000',0,'5h20m'),(44,'Maceman',4,88,40,48,63,165,'55000','65000','65000',0,'8h'),(45,'Maceman',5,90,42,50,65,175,'80000','90000','90000',0,'14h30m'),(46,'Maceman',6,91,43,52,67,180,'130000','150000','150000',0,'19h'),(47,'Maceman',7,92,45,53,68,185,'180000','200000','200000',0,'1d'),(48,'Maceman',8,92,47,55,70,195,'250000','350000','350000',0,'1d5h'),(49,'Maceman',9,93,49,56,72,200,'400000','500000','500000',0,'2d'),(50,'Maceman',10,93,50,58,75,215,'600000','700000','700000',0,'2d8h'),(51,'Maceman',11,94,52,59,78,220,'650000','850000','850000',0,'2d10h'),(52,'Maceman',12,95,53,61,80,230,'750000','950000','950000',0,'3d'),(53,'Maceman',13,96,54,65,85,250,'800000','1000000','1000000',0,'3d8h'),(54,'Maceman',14,96,55,67,86,255,'850000','1100000','1100000',0,'3d15h'),(55,'Maceman',15,97,57,69,87,260,'900000','1200000','1200000',0,'4d'),(56,'Maceman',16,99,60,70,88,265,'1000000','1400000','1400000',0,'4d5h'),(57,'Maceman',17,100,63,71,90,270,'1000000','1500000','1500000',0,'4d12h'),(58,'Maceman',18,102,68,75,92,280,'1100000','1700000','1700000',0,'4d21h'),(59,'Maceman',19,105,70,80,93,290,'1200000','1900000','1900000',0,'5d'),(60,'Maceman',20,110,85,85,95,310,'1500000','2000000','2000000',0,'5d'),(61,'Spy',1,35,25,0,70,80,'5000','5000','5000',0,'30m'),(62,'Spy',2,36,26,0,76,86,'15000','15000','15000',0,'45m'),(63,'Spy',3,36,26,0,77,90,'25000','25000','25000',0,'1h'),(64,'Spy',4,37,27,0,79,93,'55000','55000','55000',0,'1h30m'),(65,'Spy',5,37,27,0,80,95,'80000','80000','80000',0,'2h20m'),(66,'Spy',6,38,28,0,82,105,'130000','130000','130000',0,'3h30m'),(67,'Spy',7,39,28,0,83,110,'180000','180000','180000',0,'6h'),(68,'Spy',8,40,29,0,85,115,'250000','250000','250000',0,'8h30m'),(69,'Spy',9,41,30,0,87,120,'400000','400000','400000',0,'12h'),(70,'Spy',10,41,31,0,88,125,'600000','600000','600000',0,'18h'),(71,'Spy',11,42,32,0,90,130,'600000','600000','600000',0,'22h'),(72,'Spy',12,43,33,0,92,140,'750000','750000','750000',0,'1d'),(73,'Spy',13,44,33,0,95,142,'800000','800000','800000',0,'1d3h'),(74,'Spy',14,45,34,0,98,145,'850000','850000','850000',0,'1d18h'),(75,'Spy',15,46,36,0,100,155,'900000','900000','900000',0,'2d'),(76,'Spy',16,46,36,0,101,160,'1000000','1000000','1000000',0,'2d8h'),(77,'Spy',17,47,37,0,103,170,'1000000','1000000','1000000',0,'2d15h'),(78,'Spy',18,48,37,0,104,180,'1100000','1100000','1100000',0,'2d22h'),(79,'Spy',19,50,38,0,108,185,'1200000','1200000','1200000',0,'3d'),(80,'Spy',20,55,38,0,110,200,'1500000','1500000','1500000',0,'3d12h'),(81,'Archer',1,70,70,50,70,160,'10000','15000','20000',0,'2h'),(82,'Archer',2,71,71,51,72,170,'15000','25000','35000',0,'3h30m'),(83,'Archer',3,72,72,52,74,175,'35000','45000','65000',0,'5h'),(84,'Archer',4,73,74,53,79,185,'55000','65000','75000',0,'7h30m'),(85,'Archer',5,73,75,55,80,195,'80000','90000','100000',0,'10h20m'),(86,'Archer',6,74,77,58,82,200,'130000','150000','180000',0,'15h'),(87,'Archer',7,74,79,60,83,205,'180000','200000','240000',0,'18h'),(88,'Archer',8,75,80,61,85,115,'250000','350000','390000',0,'23h'),(89,'Archer',9,76,81,62,87,220,'400000','500000','600000',0,'1d2h'),(90,'Archer',10,76,82,65,88,225,'600000','700000','850000',0,'1d5h'),(91,'Archer',11,77,84,68,90,230,'650000','850000','950000',0,'1d18h'),(92,'Archer',12,77,85,72,92,240,'750000','950000','1100000',0,'2d'),(93,'Archer',13,78,87,75,95,260,'800000','1000000','1200000',0,'2d10h'),(94,'Archer',14,79,90,80,98,265,'850000','1100000','1300000',0,'2d15h'),(95,'Archer',15,80,100,85,100,280,'900000','1200000','1500000',0,'2d23h'),(96,'Archer',16,81,101,86,101,295,'1000000','1400000','1500000',0,'3d'),(97,'Archer',17,82,102,88,103,310,'1000000','1500000','1700000',0,'3d'),(98,'Archer',18,83,115,90,114,320,'1100000','1700000','1900000',0,'3d8h'),(99,'Archer',19,85,117,95,118,340,'1200000','1900000','2200000',0,'3d11h'),(100,'Archer',20,90,130,100,140,370,'1500000','2000000','2500000',0,'4d'),(101,'Horseman',1,105,70,65,100,160,'35000','25000','25000',0,'3h'),(102,'Horseman',2,106,71,67,102,170,'55000','45000','45000',0,'5h'),(103,'Horseman',3,107,72,68,105,175,'85000','75000','75000',0,'8h'),(104,'Horseman',4,108,74,69,115,185,'115000','95000','95000',0,'12h'),(105,'Horseman',5,109,75,70,117,195,'140000','110000','110000',0,'18h'),(106,'Horseman',6,110,77,72,119,200,'180000','150000','150000',0,'22h'),(107,'Horseman',7,111,79,74,130,205,'220000','180000','180000',0,'1d5h'),(108,'Horseman',8,112,80,76,135,115,'300000','250000','250000',0,'1d10h'),(109,'Horseman',9,113,81,78,145,220,'500000','400000','400000',0,'1d16h'),(110,'Horseman',10,113,82,80,150,225,'750000','600000','600000',0,'1d22h'),(111,'Horseman',11,114,84,81,155,230,'900000','600000','600000',0,'2d'),(112,'Horseman',12,115,85,83,165,240,'1000000','750000','750000',0,'2d'),(113,'Horseman',13,115,87,85,180,260,'1200000','800000','800000',0,'2d12h'),(114,'Horseman',14,116,89,86,185,275,'1300000','850000','850000',0,'2d22h'),(115,'Horseman',15,117,90,88,190,290,'1500000','1000000','1000000',0,'3d'),(116,'Horseman',16,118,91,90,195,305,'1700000','1200000','1200000',0,'3d'),(117,'Horseman',17,119,92,95,200,330,'2000000','1500000','1500000',0,'3d12h'),(118,'Horseman',18,120,95,100,210,350,'2300000','1800000','1800000',0,'4d'),(119,'Horseman',19,121,97,105,215,370,'2500000','2000000','2000000',0,'4d5h'),(120,'Horseman',20,125,100,110,230,400,'3500000','2500000','2500000',0,'5d'),(121,'Knights',1,180,95,80,100,180,'45000','25000','45000',0,'8h'),(122,'Knights',2,181,96,81,102,190,'65000','45000','65000',0,'10h'),(123,'Knights',3,182,97,82,104,195,'105000','75000','105000',0,'18h'),(124,'Knights',4,183,98,83,106,205,'135000','95000','135000',0,'23h'),(125,'Knights',5,184,99,84,110,215,'180000','120000','180000',0,'1d'),(126,'Knights',6,185,100,85,114,220,'220000','150000','220000',0,'1d12h'),(127,'Knights',7,186,101,86,116,225,'300000','180000','300000',0,'1d18h'),(128,'Knights',8,187,103,87,119,235,'500000','250000','500000',0,'2d'),(129,'Knights',9,188,105,88,120,245,'750000','400000','750000',0,'2d12h'),(130,'Knights',10,189,107,89,124,250,'900000','600000','900000',0,'2d22h'),(131,'Knights',11,190,108,90,128,260,'1200000','700000','1200000',0,'3d'),(132,'Knights',12,191,109,92,132,270,'1400000','850000','1400000',0,'3d'),(133,'Knights',13,192,110,93,135,280,'1500000','950000','1500000',0,'3d15h'),(134,'Knights',14,193,112,95,140,295,'1800000','1100000','1800000',0,'3d23h'),(135,'Knights',15,195,114,97,145,310,'2000000','1200000','2000000',0,'4d'),(136,'Knights',16,197,115,99,150,325,'2300000','1400000','2300000',0,'4d3h'),(137,'Knights',17,198,117,100,155,340,'2500000','1600000','2500000',0,'4d16h'),(138,'Knights',18,199,119,102,160,360,'2800000','1800000','2800000',0,'5d'),(139,'Knights',19,200,120,103,170,390,'3500000','2000000','3500000',0,'5d22h'),(140,'Knights',20,210,122,105,180,450,'5000000','3000000','5000000',0,'6d'),(141,'Balloon',1,120,100,0,160,105,'100000','100000','0',5000,'12h'),(142,'Balloon',2,121,102,0,165,110,'150000','150000','0',8000,'1d'),(143,'Balloon',3,122,103,0,170,115,'175000','175000','0',10000,'1d12h'),(144,'Balloon',4,124,104,0,175,125,'200000','200000','0',13000,'2d'),(145,'Balloon',5,125,105,0,180,130,'250000','250000','0',18000,'2d12h'),(146,'Balloon',6,126,106,0,185,140,'320000','320000','0',20000,'2d15h'),(147,'Balloon',7,127,108,0,190,145,'400000','400000','0',30000,'2d18h'),(148,'Balloon',8,129,109,0,200,150,'500000','500000','0',40000,'3d'),(149,'Balloon',9,130,110,0,205,160,'650000','650000','0',60000,'3d'),(150,'Balloon',10,131,112,0,207,165,'800000','800000','0',90000,'3d'),(151,'Balloon',11,133,113,0,208,175,'1000000','1000000','0',100000,'3d12h'),(152,'Balloon',12,135,114,0,210,182,'1200000','1200000','0',130000,'3d15h'),(153,'Balloon',13,136,115,0,212,185,'1400000','1400000','0',150000,'3d18h'),(154,'Balloon',14,138,117,0,215,195,'1500000','1500000','0',180000,'3d22h'),(155,'Balloon',15,139,118,0,220,210,'1700000','1700000','0',200000,'4d'),(156,'Balloon',16,140,120,0,223,215,'2000000','2000000','0',230000,'4d'),(157,'Balloon',17,142,122,0,228,225,'2200000','2200000','0',270000,'4d5h'),(158,'Balloon',18,145,123,0,230,230,'2500000','2500000','0',300000,'4d15h'),(159,'Balloon',19,147,125,0,232,240,'3000000','3000000','0',350000,'5d'),(160,'Balloon',20,150,130,0,235,260,'4000000','4000000','0',400000,'6d'),(161,'Battering ram',1,65,45,0,40,180,'15000','35000','45000',0,'2h'),(162,'Battering ram',2,66,46,0,41,190,'25000','45000','65000',0,'3h30m'),(163,'Battering ram',3,67,46,0,42,195,'50000','75000','105000',0,'5h'),(164,'Battering ram',4,68,47,0,43,205,'70000','95000','135000',0,'8h'),(165,'Battering ram',5,69,48,0,44,215,'100000','150000','180000',0,'15h'),(166,'Battering ram',6,70,48,0,45,220,'120000','180000','220000',0,'18h'),(167,'Battering ram',7,72,49,0,46,225,'200000','250000','300000',0,'1d'),(168,'Battering ram',8,73,49,0,47,235,'300000','400000','500000',0,'1d'),(169,'Battering ram',9,75,50,0,48,245,'450000','600000','750000',0,'1d12h'),(170,'Battering ram',10,76,50,0,49,250,'500000','700000','800000',0,'2d'),(171,'Battering ram',11,78,51,0,50,260,'600000','800000','1000000',0,'2d'),(172,'Battering ram',12,80,52,0,51,270,'650000','850000','1100000',0,'2d20h'),(173,'Battering ram',13,81,53,0,52,280,'700000','950000','1200000',0,'2d23h'),(174,'Battering ram',14,82,53,0,53,295,'800000','1000000','1300000',0,'3d'),(175,'Battering ram',15,84,54,0,54,310,'1000000','1100000','1400000',0,'3d12h'),(176,'Battering ram',16,85,55,0,55,325,'1100000','1200000','1500000',0,'4d'),(177,'Battering ram',17,87,56,0,56,340,'1300000','1500000','2000000',0,'4d12h'),(178,'Battering ram',18,88,56,0,58,360,'1500000','1800000','2300000',0,'4d21h'),(179,'Battering ram',19,89,57,0,60,390,'1800000','2000000','2500000',0,'5d'),(180,'Battering ram',20,90,60,0,65,450,'2000000','2500000','3000000',0,'7d'),(181,'Heavy Catapult',1,85,50,0,28,180,'15000','35000','45000',0,'2h'),(182,'Heavy Catapult',2,86,51,0,30,190,'25000','45000','65000',0,'3h30m'),(183,'Heavy Catapult',3,87,52,0,32,195,'50000','75000','105000',0,'5h'),(184,'Heavy Catapult',4,88,53,0,33,205,'70000','95000','135000',0,'8h'),(185,'Heavy Catapult',5,90,54,0,35,215,'100000','150000','180000',0,'15h'),(186,'Heavy Catapult',6,91,55,0,36,220,'120000','180000','220000',0,'18h'),(187,'Heavy Catapult',7,92,56,0,38,225,'200000','250000','300000',0,'1d'),(188,'Heavy Catapult',8,92,57,0,40,235,'300000','400000','500000',0,'1d'),(189,'Heavy Catapult',9,93,58,0,41,245,'450000','600000','750000',0,'1d12h'),(190,'Heavy Catapult',10,93,59,0,43,250,'500000','700000','800000',0,'2d'),(191,'Heavy Catapult',11,94,60,0,44,260,'600000','800000','1000000',0,'2d'),(192,'Heavy Catapult',12,95,62,0,45,270,'650000','850000','1100000',0,'2d20h'),(193,'Heavy Catapult',13,96,63,0,46,280,'700000','950000','1200000',0,'2d23h'),(194,'Heavy Catapult',14,96,64,0,47,295,'800000','1000000','1300000',0,'3d'),(195,'Heavy Catapult',15,97,65,0,48,310,'1000000','1100000','1400000',0,'3d12h'),(196,'Heavy Catapult',16,99,66,0,49,325,'1100000','1200000','1500000',0,'4d'),(197,'Heavy Catapult',17,100,67,0,50,340,'1300000','1500000','2000000',0,'4d12h'),(198,'Heavy Catapult',18,102,68,0,51,360,'1500000','1800000','2300000',0,'4d21h'),(199,'Heavy Catapult',19,105,69,0,52,390,'1800000','2000000','2500000',0,'5d'),(200,'Heavy Catapult',20,110,70,0,55,450,'2000000','2500000','3000000',0,'7d'),(201,'Specialist',1,0,0,0,1,1,'10000','10000','10000',0,'10m'),(202,'Specialist',20,0,0,0,1,1,'10000','10000','10000',0,'1h');
/*!40000 ALTER TABLE `forces` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guest_forces`
--

DROP TABLE IF EXISTS `guest_forces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guest_forces` (
  `id` int NOT NULL AUTO_INCREMENT,
  `receiverToken` varchar(255) NOT NULL,
  `senderToken` varchar(255) NOT NULL,
  `forces` json NOT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guest_forces`
--

LOCK TABLES `guest_forces` WRITE;
/*!40000 ALTER TABLE `guest_forces` DISABLE KEYS */;
/*!40000 ALTER TABLE `guest_forces` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender` varchar(225) DEFAULT NULL,
  `receiver` varchar(225) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `clan` int DEFAULT NULL,
  `contentRT` varchar(225) DEFAULT NULL,
  `timeRT` varchar(45) DEFAULT NULL,
  `read` int DEFAULT '0',
  `subject` varchar(125) DEFAULT 'Message',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=462 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mine_types`
--

DROP TABLE IF EXISTS `mine_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mine_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `level` int NOT NULL,
  `capacity` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `mine_types_chk_1` CHECK ((`level` between 1 and 3)),
  CONSTRAINT `mine_types_chk_2` CHECK ((`capacity` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mine_types`
--

LOCK TABLES `mine_types` WRITE;
/*!40000 ALTER TABLE `mine_types` DISABLE KEYS */;
INSERT INTO `mine_types` VALUES (1,'stone',1,25000,'2025-03-09 09:05:36'),(2,'stone',2,100000,'2025-03-09 09:05:36'),(3,'stone',3,500000,'2025-03-09 09:05:36'),(4,'wood',1,25000,'2025-03-09 09:05:36'),(5,'wood',2,100000,'2025-03-09 09:05:36'),(6,'wood',3,500000,'2025-03-09 09:05:36'),(7,'iron',1,25000,'2025-03-09 09:05:36'),(8,'iron',2,100000,'2025-03-09 09:05:36'),(9,'iron',3,500000,'2025-03-09 09:05:36'),(10,'wheat',1,25000,'2025-03-09 09:05:36'),(11,'wheat',2,100000,'2025-03-09 09:05:36'),(12,'wheat',3,500000,'2025-03-09 09:05:36');
/*!40000 ALTER TABLE `mine_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mines`
--

DROP TABLE IF EXISTS `mines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mine_type_id` int NOT NULL,
  `x` int NOT NULL,
  `y` int NOT NULL,
  `remaining_resources` int NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `mine_type_id` (`mine_type_id`),
  CONSTRAINT `mines_ibfk_1` FOREIGN KEY (`mine_type_id`) REFERENCES `mine_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6301 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mines`
--

LOCK TABLES `mines` WRITE;
/*!40000 ALTER TABLE `mines` DISABLE KEYS */;
/*!40000 ALTER TABLE `mines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `moving_forces`
--

DROP TABLE IF EXISTS `moving_forces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `moving_forces` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `forces` json NOT NULL,
  `start_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `arrival_time` timestamp NOT NULL,
  `type` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `moving_forces`
--

LOCK TABLES `moving_forces` WRITE;
/*!40000 ALTER TABLE `moving_forces` DISABLE KEYS */;
/*!40000 ALTER TABLE `moving_forces` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ongoingwar`
--

DROP TABLE IF EXISTS `ongoingwar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ongoingwar` (
  `battleId` int NOT NULL AUTO_INCREMENT,
  `attack` varchar(255) DEFAULT NULL,
  `defence` varchar(255) DEFAULT NULL,
  `distance` float DEFAULT NULL,
  `travelTime` float DEFAULT NULL,
  `startTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(50) DEFAULT 'ongoing',
  `winner` varchar(45) DEFAULT NULL,
  `result` json DEFAULT NULL,
  PRIMARY KEY (`battleId`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ongoingwar`
--

LOCK TABLES `ongoingwar` WRITE;
/*!40000 ALTER TABLE `ongoingwar` DISABLE KEYS */;
/*!40000 ALTER TABLE `ongoingwar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playerbuildings`
--

DROP TABLE IF EXISTS `playerbuildings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playerbuildings` (
  `playerToken` int NOT NULL,
  `buildings` json DEFAULT NULL,
  PRIMARY KEY (`playerToken`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playerbuildings`
--

LOCK TABLES `playerbuildings` WRITE;
/*!40000 ALTER TABLE `playerbuildings` DISABLE KEYS */;
/*!40000 ALTER TABLE `playerbuildings` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `set_default_buildings` BEFORE INSERT ON `playerbuildings` FOR EACH ROW BEGIN
    IF NEW.buildings IS NULL THEN
        SET NEW.buildings = '[{"level": 1, "position": {"x": -303, "y": 82.5}, "building_id": 1}, {"level": 1, "position": {"x": -280, "y": -146.25}, "building_id": 2}, {"level": 1, "position": {"x": 213.75, "y": -195}, "building_id": 3}, {"level": 1, "position": {"x": 133.75, "y": 115}, "building_id": 4}]';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `playeremailtable`
--

DROP TABLE IF EXISTS `playeremailtable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playeremailtable` (
  `id` int NOT NULL,
  `email` varchar(225) DEFAULT NULL,
  `borderX` int DEFAULT NULL,
  `borderY` int DEFAULT NULL,
  `civilization` varchar(255) DEFAULT NULL,
  `allPopulation` varchar(225) DEFAULT NULL,
  `users` varchar(225) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playeremailtable`
--

LOCK TABLES `playeremailtable` WRITE;
/*!40000 ALTER TABLE `playeremailtable` DISABLE KEYS */;
/*!40000 ALTER TABLE `playeremailtable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playerstats`
--

DROP TABLE IF EXISTS `playerstats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playerstats` (
  `playerToken` int NOT NULL,
  `defense_power` int DEFAULT '0',
  `civilization_points` int DEFAULT '20',
  `population_consumers` int DEFAULT '6',
  `training_time_reduction_percent` int DEFAULT '0',
  `ballon_destroy_point` int DEFAULT '0',
  `member_limit` int DEFAULT '0',
  `attack_limit` int DEFAULT '0',
  `defense_power_increase_percent` int DEFAULT '0',
  `troop_speed_boost` int DEFAULT '0',
  `training_time_reduction` int DEFAULT '0',
  `updating_time_reduction` int DEFAULT '0',
  `elixir_production` int DEFAULT '0',
  `wheat_production` int DEFAULT '60',
  `iron_production` int DEFAULT '60',
  `wood_production` int DEFAULT '60',
  `stone_production` int DEFAULT '60',
  `storage_capacity` int DEFAULT '2500',
  `build_time_reduction` int DEFAULT '0',
  PRIMARY KEY (`playerToken`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playerstats`
--

LOCK TABLES `playerstats` WRITE;
/*!40000 ALTER TABLE `playerstats` DISABLE KEYS */;
/*!40000 ALTER TABLE `playerstats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prize`
--

DROP TABLE IF EXISTS `prize`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prize` (
  `prizeID` int NOT NULL,
  `citypositionX` int DEFAULT NULL,
  `citypositionY` int DEFAULT NULL,
  `force` json DEFAULT NULL,
  `loot` json DEFAULT NULL,
  PRIMARY KEY (`prizeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prize`
--

LOCK TABLES `prize` WRITE;
/*!40000 ALTER TABLE `prize` DISABLE KEYS */;
/*!40000 ALTER TABLE `prize` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specialists`
--

DROP TABLE IF EXISTS `specialists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `specialists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `playerToken` int NOT NULL,
  `mine_id` int NOT NULL,
  `count` int NOT NULL,
  `last_extracted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `playerToken` (`playerToken`),
  KEY `mine_id` (`mine_id`),
  CONSTRAINT `specialists_ibfk_1` FOREIGN KEY (`playerToken`) REFERENCES `users` (`playerToken`) ON DELETE CASCADE,
  CONSTRAINT `specialists_ibfk_2` FOREIGN KEY (`mine_id`) REFERENCES `mines` (`id`) ON DELETE CASCADE,
  CONSTRAINT `specialists_chk_1` CHECK (((`count` > 0) and (`count` <= 100)))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specialists`
--

LOCK TABLES `specialists` WRITE;
/*!40000 ALTER TABLE `specialists` DISABLE KEYS */;
/*!40000 ALTER TABLE `specialists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hash` varchar(66) NOT NULL,
  `gemAmount` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `updateforces`
--

DROP TABLE IF EXISTS `updateforces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `updateforces` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `stone` int NOT NULL,
  `wood` int NOT NULL,
  `iron` int NOT NULL,
  `wheat` int NOT NULL,
  `consumer` int NOT NULL,
  `production_time` time NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `updateforces`
--

LOCK TABLES `updateforces` WRITE;
/*!40000 ALTER TABLE `updateforces` DISABLE KEYS */;
INSERT INTO `updateforces` VALUES (1,'Infantry',150,120,100,30,1,'00:04:30'),(2,'Swordsman',200,150,160,80,1,'00:05:30'),(3,'Maceman',280,120,150,100,1,'00:05:50'),(4,'Spy',60,120,160,40,2,'00:05:00'),(5,'Archer',250,150,180,110,1,'00:06:00'),(6,'Horseman',280,350,250,220,3,'00:08:00'),(7,'Knights',750,500,600,160,4,'00:11:00'),(8,'Battering ram',550,850,400,85,4,'00:14:00'),(9,'Heavy Catapult',600,1100,1250,950,6,'00:24:00'),(10,'Specialist',10000,10000,10000,10000,1,'00:04:00');
/*!40000 ALTER TABLE `updateforces` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `upgrade_queue`
--

DROP TABLE IF EXISTS `upgrade_queue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `upgrade_queue` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `force_name` varchar(50) NOT NULL,
  `current_level` int NOT NULL,
  `next_level` int NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `upgrade_queue_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_forces_json` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `upgrade_queue`
--

LOCK TABLES `upgrade_queue` WRITE;
/*!40000 ALTER TABLE `upgrade_queue` DISABLE KEYS */;
/*!40000 ALTER TABLE `upgrade_queue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_forces_json`
--

DROP TABLE IF EXISTS `user_forces_json`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_forces_json` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `forces` json NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `upgrading_forces` json DEFAULT NULL,
  `specialists` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_forces_json_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`playerToken`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_forces_json`
--

LOCK TABLES `user_forces_json` WRITE;
/*!40000 ALTER TABLE `user_forces_json` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_forces_json` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `playerToken` int NOT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `username` varchar(45) DEFAULT NULL,
  `avatarCode` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT 'M_01',
  `bio` varchar(255) DEFAULT 'Hi there ...!',
  `wheat` int DEFAULT '0',
  `stone` int DEFAULT '0',
  `wood` int DEFAULT '0',
  `iron` int DEFAULT '0',
  `elixir` int DEFAULT '0',
  `population` int DEFAULT '6',
  `civilization` int DEFAULT '20',
  `wheatrate` int DEFAULT '60',
  `stonerate` int DEFAULT '60',
  `woodrate` int DEFAULT '60',
  `ironrate` int DEFAULT '60',
  `elixirrate` int DEFAULT '0',
  `capacity` int DEFAULT '5000',
  `citypositionY` int DEFAULT '0',
  `citypositionX` int DEFAULT '0',
  `cityName` varchar(150) DEFAULT 'Eternal City',
  `clan_id` int DEFAULT '0',
  `clan_role` varchar(255) DEFAULT 'member',
  `gem` int DEFAULT '0',
  `recivedRequests` json DEFAULT NULL,
  PRIMARY KEY (`playerToken`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wars`
--

DROP TABLE IF EXISTS `wars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wars` (
  `id` int NOT NULL AUTO_INCREMENT,
  `attackerPlayerToken` varchar(255) DEFAULT NULL,
  `defenderPlayerToken` varchar(255) DEFAULT NULL,
  `attackerForce` json DEFAULT NULL,
  `attackerMachine` json DEFAULT NULL,
  `mode` enum('battle','raid','spy') DEFAULT NULL,
  `travelTime` int DEFAULT NULL,
  `scheduledStartTime` datetime DEFAULT NULL,
  `warStatus` enum('scheduled','ongoing','finished') DEFAULT 'scheduled',
  `result` json DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=198 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wars`
--

LOCK TABLES `wars` WRITE;
/*!40000 ALTER TABLE `wars` DISABLE KEYS */;
/*!40000 ALTER TABLE `wars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'battle-of-eternals'
--

--
-- Dumping routines for database 'battle-of-eternals'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-07 15:25:30
