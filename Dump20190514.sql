CREATE DATABASE  IF NOT EXISTS `partnermes` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `partnermes`;
-- MySQL dump 10.13  Distrib 5.6.24, for Win32 (x86)
--
-- Host: localhost    Database: partnermes
-- ------------------------------------------------------
-- Server version	5.6.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kod` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(155) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(155) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contacts` varchar(155) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clients_id_unique` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,'C00001','Klient 1','Adres klienta 1','USA','telefon: 999-11-22',NULL,NULL),(2,'C00002','Klient 2','Adres klienta 2','Germany','telefon: 222-33-44',NULL,NULL),(3,'C00003','Klient 3','Adres klienta 3','Poland','telefon: 333-44-55',NULL,NULL),(4,'C00004','Klient 4','Adres klienta 4','Ukraine','telefon: 555-66-77',NULL,NULL),(5,'C00005','Klient 5','Adres klienta 5','Russia','telefon: 333-77-88',NULL,NULL),(6,'C00006','Klient 6','Adres klienta 6','Poland','telefon: 999-33-44',NULL,NULL),(7,'C00007','Klient 7','Adres klienta 7','Germany','telefon: 444-55-66',NULL,NULL),(8,'C00008','Klient 8','Adres klienta 8','Holland','telefon: 999-22-11',NULL,NULL),(9,'C00009','Klient 9','Adres klienta 9','Poland','telefon: 345-09-33',NULL,NULL),(10,'C00010','Klient 10','Adres klienta 10','Poland ','telefon: 943-45-00',NULL,NULL);
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `components`
--

DROP TABLE IF EXISTS `components`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `components` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `component_id` int(10) unsigned NOT NULL,
  `amount` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `components_product_id_foreign` (`product_id`),
  KEY `components_component_id_foreign` (`component_id`),
  CONSTRAINT `components_component_id_foreign` FOREIGN KEY (`component_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `components_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `components`
--

LOCK TABLES `components` WRITE;
/*!40000 ALTER TABLE `components` DISABLE KEYS */;
INSERT INTO `components` VALUES (1,1,4,1,NULL,NULL),(2,1,18,6,NULL,NULL),(3,1,27,1,NULL,NULL),(4,2,5,1,NULL,NULL),(5,2,19,8,NULL,NULL),(6,2,28,1,NULL,NULL),(7,3,6,1,NULL,NULL),(8,3,20,10,NULL,NULL),(9,3,29,1,NULL,NULL),(10,1,36,10,NULL,NULL),(11,2,37,8,NULL,NULL),(12,3,38,12,NULL,NULL);
/*!40000 ALTER TABLE `components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departaments`
--

DROP TABLE IF EXISTS `departaments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `departaments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `departaments_parent_id_foreign` (`parent_id`),
  CONSTRAINT `departaments_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `departaments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departaments`
--

LOCK TABLES `departaments` WRITE;
/*!40000 ALTER TABLE `departaments` DISABLE KEYS */;
INSERT INTO `departaments` VALUES (1,'Produkcja',1,NULL,NULL),(2,'Transport',2,NULL,NULL),(3,'Przygotowanie',3,NULL,NULL),(4,'Wykonczenie',4,NULL,NULL);
/*!40000 ALTER TABLE `departaments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_000000_create_users_table',1),(2,'2019_05_10_201801_create_roles_table',1),(3,'2019_05_10_202039_create_users_roles_table',1),(4,'2019_05_10_202447_create_permissions_table',1),(5,'2019_05_10_202802_create_roles_permissions_table',1),(6,'2019_05_10_203303_create_workers_table',1),(7,'2019_05_10_203518_create_departaments_table',1),(8,'2019_05_10_203717_create_worker_departaments_table',1),(9,'2019_05_10_203925_create_clients_table',1),(10,'2019_05_10_204659_create_product_types_table',1),(11,'2019_05_10_205841_create_product_groups_table',1),(12,'2019_05_10_210542_create_products_table',1),(13,'2019_05_10_211322_create_components_table',1),(14,'2019_05_10_211806_create_orders_table',1),(15,'2019_05_10_212427_create_orders_positions_table',1),(16,'2019_05_10_212650_create_statuses_table',1),(17,'2019_05_10_212839_create_tasks_groups_table',1),(18,'2019_05_10_213041_create_orders_history_table',1),(19,'2019_05_10_220107_create_tasks_table',1),(20,'2019_05_10_220453_create_warehouse_table',1),(21,'2019_05_10_220739_create_product_groups_tasks_table',1),(22,'2019_05_10_221537_create_product_tasks_table',1),(23,'2019_05_12_192012_create_operations_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operations`
--

DROP TABLE IF EXISTS `operations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `worker_id` int(10) unsigned NOT NULL,
  `order_position_id` int(10) unsigned NOT NULL,
  `task_id` int(10) unsigned NOT NULL,
  `amount` int(11) NOT NULL,
  `date_start` datetime NOT NULL,
  `date_end` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `operations_worker_id_foreign` (`worker_id`),
  KEY `operations_order_position_id_foreign` (`order_position_id`),
  KEY `operations_task_id_foreign` (`task_id`),
  CONSTRAINT `operations_order_position_id_foreign` FOREIGN KEY (`order_position_id`) REFERENCES `orders_positions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `operations_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `operations_worker_id_foreign` FOREIGN KEY (`worker_id`) REFERENCES `workers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operations`
--

LOCK TABLES `operations` WRITE;
/*!40000 ALTER TABLE `operations` DISABLE KEYS */;
/*!40000 ALTER TABLE `operations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kod` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_id` int(10) unsigned NOT NULL,
  `date_start` datetime NOT NULL,
  `date_end` datetime NOT NULL,
  `description` varchar(155) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_kod_unique` (`kod`),
  KEY `orders_client_id_foreign` (`client_id`),
  CONSTRAINT `orders_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (11,'Z00001','Zamowienie 1',1,'2019-05-03 08:00:00','2019-05-20 19:00:00','',NULL,NULL),(12,'Z00002','Zamowienie 2',1,'2019-04-20 08:00:00','2019-05-20 19:00:00','',NULL,NULL),(13,'Z00003','Zamowienie 3',2,'2019-05-10 08:00:00','2019-06-04 19:00:00','',NULL,NULL),(14,'Z00004','Zamowienie 4',3,'2019-05-12 08:00:00','2019-06-10 19:00:00','',NULL,NULL),(15,'Z00005','Zamowienie 5',4,'2019-05-02 08:00:00','2019-06-20 19:00:00','',NULL,NULL),(16,'Z00006','Zamowienie 6',5,'2019-05-05 08:00:00','2019-06-03 19:00:00','',NULL,NULL),(17,'Z00007','Zamowienie 7',5,'2019-04-20 08:00:00','2019-06-16 19:00:00','',NULL,NULL),(18,'Z00008','Zamowienie 8',6,'2019-05-03 08:00:00','2019-05-18 19:00:00','',NULL,NULL),(19,'Z00009','Zamowienie 9',7,'2019-05-11 08:00:00','2019-06-13 19:00:00','',NULL,NULL),(20,'Z00010','Zamowienie 10',8,'2019-05-04 08:00:00','2019-05-27 19:00:00','',NULL,NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders_history`
--

DROP TABLE IF EXISTS `orders_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders_history` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int(10) unsigned NOT NULL,
  `status_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_history_order_id_foreign` (`order_id`),
  KEY `orders_history_status_id_foreign` (`status_id`),
  CONSTRAINT `orders_history_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `orders_history_status_id_foreign` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders_history`
--

LOCK TABLES `orders_history` WRITE;
/*!40000 ALTER TABLE `orders_history` DISABLE KEYS */;
INSERT INTO `orders_history` VALUES (1,11,2,NULL,NULL),(2,12,3,NULL,NULL),(3,13,1,NULL,NULL),(4,14,1,NULL,NULL),(5,15,2,NULL,NULL),(6,16,2,NULL,NULL),(7,17,2,NULL,NULL),(8,18,4,NULL,NULL),(9,19,1,NULL,NULL),(10,20,2,NULL,NULL);
/*!40000 ALTER TABLE `orders_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders_positions`
--

DROP TABLE IF EXISTS `orders_positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders_positions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kod` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` int(10) unsigned NOT NULL,
  `product_id` int(10) unsigned NOT NULL,
  `amount` int(11) NOT NULL,
  `date_delivery` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_positions_kod_unique` (`kod`),
  KEY `orders_positions_order_id_foreign` (`order_id`),
  CONSTRAINT `orders_positions_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders_positions`
--

LOCK TABLES `orders_positions` WRITE;
/*!40000 ALTER TABLE `orders_positions` DISABLE KEYS */;
INSERT INTO `orders_positions` VALUES (1,'OP00001',11,1,1,'2019-05-17 17:00:00',NULL,NULL),(2,'OP00002',11,4,8,'2019-05-19 17:00:00',NULL,NULL),(3,'OP00003',12,2,2,'2019-05-10 17:00:00',NULL,NULL),(4,'OP00004',12,5,10,'2019-05-17 17:00:00',NULL,NULL),(5,'OP00005',12,36,20,'2019-05-20 17:00:00',NULL,NULL),(6,'OP00006',13,6,10,'2019-05-07 15:00:00',NULL,NULL),(7,'OP00007',13,2,2,'2019-05-10 12:00:00',NULL,NULL),(8,'OP00008',14,1,1,'2019-05-11 15:00:00',NULL,NULL),(9,'OP00009',14,8,10,'2019-05-12 17:00:00',NULL,NULL),(10,'OP00010',15,2,2,'2019-06-05 17:00:00',NULL,NULL),(11,'OP00011',15,10,10,'2019-06-11 15:30:00',NULL,NULL),(12,'OP00012',15,18,20,'2019-06-17 17:00:00',NULL,NULL),(13,'OP00013',15,6,5,'2019-06-20 17:00:00',NULL,NULL),(14,'OP00014',16,3,2,'2019-05-20 17:00:00',NULL,NULL),(15,'OP00015',16,19,30,'2019-06-02 17:00:00',NULL,NULL),(16,'OP00016',16,1,1,'2019-06-03 17:00:00',NULL,NULL),(21,'OP00017',17,19,20,'2019-04-30 17:00:00',NULL,NULL),(22,'OP00018',17,1,4,'2019-05-20 17:00:00',NULL,NULL),(23,'OP00019',17,5,15,'2019-06-16 17:00:00',NULL,NULL),(24,'OP00020',18,2,2,'2019-05-18 17:00:00',NULL,NULL),(25,'OP00021',19,3,2,'2019-05-25 17:00:00',NULL,NULL),(26,'OP00022',19,5,10,'2019-06-04 17:00:00',NULL,NULL),(27,'OP00023',19,19,30,'2019-06-13 17:00:00',NULL,NULL),(32,'OP00024',20,1,2,'2019-05-15 17:00:00',NULL,NULL),(33,'OP00025',20,2,2,'2019-05-20 17:00:00',NULL,NULL),(34,'OP00026',20,28,20,'2019-05-25 17:00:00',NULL,NULL),(35,'OP00027',20,5,20,'2019-05-27 17:00:00',NULL,NULL);
/*!40000 ALTER TABLE `orders_positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(155) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_groups`
--

DROP TABLE IF EXISTS `product_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_groups` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_groups_parent_id_foreign` (`parent_id`),
  CONSTRAINT `product_groups_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `product_groups` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_groups`
--

LOCK TABLES `product_groups` WRITE;
/*!40000 ALTER TABLE `product_groups` DISABLE KEYS */;
INSERT INTO `product_groups` VALUES (1,'Bramy',1,NULL,NULL),(2,'Kraty',2,NULL,NULL),(3,'Płoty',3,NULL,NULL),(4,'Nakrętki',4,NULL,NULL),(5,'śruby',5,NULL,NULL),(6,'Ramy',6,NULL,NULL),(7,'Rury',7,NULL,NULL),(8,'Druty',8,NULL,NULL),(9,'Pręty',9,NULL,NULL),(10,'Elementy dekoracyjne',10,NULL,NULL);
/*!40000 ALTER TABLE `product_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_groups_tasks`
--

DROP TABLE IF EXISTS `product_groups_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_groups_tasks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_group_id` int(10) unsigned NOT NULL,
  `task_id` int(10) unsigned NOT NULL,
  `duration` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_groups_tasks_product_group_id_foreign` (`product_group_id`),
  KEY `product_groups_tasks_task_id_foreign` (`task_id`),
  CONSTRAINT `product_groups_tasks_product_group_id_foreign` FOREIGN KEY (`product_group_id`) REFERENCES `product_groups` (`id`),
  CONSTRAINT `product_groups_tasks_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_groups_tasks`
--

LOCK TABLES `product_groups_tasks` WRITE;
/*!40000 ALTER TABLE `product_groups_tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_groups_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_tasks`
--

DROP TABLE IF EXISTS `product_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_tasks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `task_id` int(10) unsigned NOT NULL,
  `duration` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_tasks_product_id_foreign` (`product_id`),
  KEY `product_tasks_task_id_foreign` (`task_id`),
  CONSTRAINT `product_tasks_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `product_tasks_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_tasks`
--

LOCK TABLES `product_tasks` WRITE;
/*!40000 ALTER TABLE `product_tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_types`
--

DROP TABLE IF EXISTS `product_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_types` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(155) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_types`
--

LOCK TABLES `product_types` WRITE;
/*!40000 ALTER TABLE `product_types` DISABLE KEYS */;
INSERT INTO `product_types` VALUES (1,'Gotowy produckt','Produkt - jest juz gotowym towarem.',NULL,NULL),(2,'Polprodukt','Półprodukt - może być towarem lub częszczą innych produktów',NULL,NULL),(3,'Część','Część - może być towarem lub częszczą innych produktów lub półproduktów',NULL,NULL);
/*!40000 ALTER TABLE `product_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kod` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_type_id` int(10) unsigned NOT NULL,
  `weight` double(8,2) NOT NULL,
  `height` int(11) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `length` int(11) DEFAULT NULL,
  `pictures` varchar(155) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(155) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_group_id` int(10) unsigned NOT NULL,
  `area` double(8,2) NOT NULL,
  `pack` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_kod_unique` (`kod`),
  KEY `products_product_type_id_foreign` (`product_type_id`),
  KEY `products_product_group_id_foreign` (`product_group_id`),
  CONSTRAINT `products_product_group_id_foreign` FOREIGN KEY (`product_group_id`) REFERENCES `product_groups` (`id`),
  CONSTRAINT `products_product_type_id_foreign` FOREIGN KEY (`product_type_id`) REFERENCES `product_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'P00001','Brama 1',1,200.00,2000,3000,NULL,'','Brama do ogrodzenia',1,6000.00,'palety',NULL,NULL),(2,'P00002','Brama 2',1,250.00,2100,3000,NULL,'','Brama do ogrodzenia',1,6100.00,'palety',NULL,NULL),(3,'P00003','Brama 3',1,150.00,1500,2000,NULL,'','Brama do ogrodzenia',1,3000.00,'palety',NULL,NULL),(4,'P00004','Kraty 1',2,30.00,0,50,2000,'','Kraty do produkowania ogrodzen',2,100000.00,'opakowanie 1',NULL,NULL),(5,'P00005','Kraty 2',2,40.00,NULL,55,2000,'','Kraty do produkowania ogrodzen',2,110000.00,'opakowanie 2',NULL,NULL),(6,'P00006','Kraty 3',2,45.00,NULL,55,2500,'','Kraty do produkowania ogrodzen',2,137500.00,'opakowanie 3',NULL,NULL),(7,'P00007','Kraty 4',2,45.00,NULL,50,2000,'','Kraty do produkowania ogrodzen',2,100000.00,'opakowanie 4',NULL,NULL),(8,'P00008','Płot 1',1,150.00,2000,3000,NULL,'','Plot 1 ',3,6000.00,'palety',NULL,NULL),(9,'P00009','Płot 2',1,200.00,2500,3000,NULL,'','Plot 2',3,7500.00,'palety',NULL,NULL),(10,'P00010','Płot 3',1,170.00,2000,3500,NULL,'','Plot 3',3,7000.00,'palety',NULL,NULL),(18,'P00011','Nakrętka 1',3,0.20,50,20,NULL,'','Nakrętka do produkowania bram',4,1000.00,'',NULL,NULL),(19,'P00012','Nakrętka 2',3,0.25,55,25,NULL,'','Nakrętka do produkowania bram',4,1375.00,'',NULL,NULL),(20,'P00013','Nakrętka 3',3,0.20,45,20,NULL,'','Nakrętka do produkowania bram',4,900.00,'',NULL,NULL),(23,'P00014','śruby 15',3,0.02,NULL,NULL,0,'','śruby do produkowania bram',5,0.00,'',NULL,NULL),(24,'P00015','śruby 20',3,0.02,NULL,NULL,0,'','śruby do produkowania bram',5,0.00,'',NULL,NULL),(25,'P00016','śruby 25',3,0.02,NULL,NULL,0,'','śruby do produkowania bram',5,0.00,'',NULL,NULL),(26,'P00017','śruby 30',3,0.03,NULL,NULL,0,'','śruby do produkowania bram',5,0.00,'',NULL,NULL),(27,'P00018','Rama 1',2,80.00,2000,3000,NULL,'','Rama do produkowania bram i płotow',6,1234.00,'',NULL,NULL),(28,'P00019','Rama 2',2,100.00,2500,3000,NULL,'','Rama do produkowania bram i płotow',6,1450.00,'',NULL,NULL),(29,'P00020','Rama 3',2,90.00,2000,3500,NULL,'','Rama do produkowania bram i płotow',6,1500.00,'',NULL,NULL),(33,'P00021','Drut 1',3,800.00,5,5,1500,'','Drut do produkowania krat',8,1500.00,'',NULL,NULL),(34,'P00022','Drut 2',3,1000.00,6,6,1500,'','Drut do produkowania krat',8,1500.00,'',NULL,NULL),(35,'P00023','Drut 3',3,900.00,4,4,2000,'','Drut do produkowania krat',8,2000.00,'',NULL,NULL),(36,'P00024','Dekoracyjny element 1',3,0.00,10,5,NULL,'','Dekoracyjny element do bram',10,65.00,'',NULL,NULL),(37,'P00025','Dekoracyjny element 2',3,0.00,12,6,NULL,'','Dekoracyjny element do bram',10,98.00,'',NULL,NULL),(38,'P00026','Dekoracyjny element 3',3,0.00,15,5,NULL,'','Dekoracyjny element do bram',10,100.00,'',NULL,NULL),(39,'P00027','Dekoracyjny element 4',3,0.00,10,4,NULL,'','Dekoracyjny element do bram',10,55.00,'',NULL,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles_permissions`
--

DROP TABLE IF EXISTS `roles_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles_permissions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `role_id` int(10) unsigned NOT NULL,
  `permission_id` int(10) unsigned NOT NULL,
  `value` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `roles_permissions_role_id_foreign` (`role_id`),
  KEY `roles_permissions_permission_id_foreign` (`permission_id`),
  CONSTRAINT `roles_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `roles_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles_permissions`
--

LOCK TABLES `roles_permissions` WRITE;
/*!40000 ALTER TABLE `roles_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statuses`
--

DROP TABLE IF EXISTS `statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `statuses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(155) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statuses`
--

LOCK TABLES `statuses` WRITE;
/*!40000 ALTER TABLE `statuses` DISABLE KEYS */;
INSERT INTO `statuses` VALUES (1,'Nowe','Zamówienie jest nowe',NULL,NULL),(2,'W opracowaniu','Zamówienie już w opracowaniu',NULL,NULL),(3,'Gotowe','Zamówienie jest gotowe do wysyłki.',NULL,NULL),(4,'Wysyłane','Zamówienie zostało wysłane do klienta, nic nie mozna zmienić w informacji o zamówieniu.',NULL,NULL),(5,'Otrzymane','Zamówienie otrzymane przez klienta.',NULL,NULL),(6,'Zamknięte','Zamówienie zostało zamknięte, już nie można nic zmieniać w informacji o zamówieniu.',NULL,NULL);
/*!40000 ALTER TABLE `statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kod` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `task_group_id` int(11) NOT NULL,
  `task_groups_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_task_groups_id_foreign` (`task_groups_id`),
  CONSTRAINT `tasks_task_groups_id_foreign` FOREIGN KEY (`task_groups_id`) REFERENCES `tasks_groups` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks_groups`
--

DROP TABLE IF EXISTS `tasks_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks_groups` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_groups_parent_id_foreign` (`parent_id`),
  CONSTRAINT `tasks_groups_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `tasks_groups` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks_groups`
--

LOCK TABLES `tasks_groups` WRITE;
/*!40000 ALTER TABLE `tasks_groups` DISABLE KEYS */;
INSERT INTO `tasks_groups` VALUES (1,'Cięcie',1,NULL,NULL),(2,'Spawanie',2,NULL,NULL),(3,'Gratowanie',3,NULL,NULL),(4,'Cięcie',4,NULL,NULL),(5,'Pakowanie',5,NULL,NULL),(6,'Kompletowanie',6,NULL,NULL),(7,'Rozpakowanie',7,NULL,NULL),(8,'Kompletowanie',8,NULL,NULL),(9,'Lakierowanie proszkowe',9,NULL,NULL),(10,'Lakierowanie ręczne',10,NULL,NULL);
/*!40000 ALTER TABLE `tasks_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kod` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstname` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `login` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(155) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_kod_unique` (`kod`),
  UNIQUE KEY `users_login_unique` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_roles`
--

DROP TABLE IF EXISTS `users_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `role_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `users_roles_role_id_foreign` (`role_id`),
  KEY `users_roles_user_id_foreign` (`user_id`),
  CONSTRAINT `users_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `users_roles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_roles`
--

LOCK TABLES `users_roles` WRITE;
/*!40000 ALTER TABLE `users_roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warehouse`
--

DROP TABLE IF EXISTS `warehouse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warehouse` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `amount` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `warehouse_product_id_foreign` (`product_id`),
  CONSTRAINT `warehouse_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouse`
--

LOCK TABLES `warehouse` WRITE;
/*!40000 ALTER TABLE `warehouse` DISABLE KEYS */;
/*!40000 ALTER TABLE `warehouse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `worker_departaments`
--

DROP TABLE IF EXISTS `worker_departaments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `worker_departaments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `worker_id` int(10) unsigned NOT NULL,
  `departament_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `worker_departaments_worker_id_foreign` (`worker_id`),
  KEY `worker_departaments_departament_id_foreign` (`departament_id`),
  CONSTRAINT `worker_departaments_departament_id_foreign` FOREIGN KEY (`departament_id`) REFERENCES `departaments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `worker_departaments_worker_id_foreign` FOREIGN KEY (`worker_id`) REFERENCES `workers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `worker_departaments`
--

LOCK TABLES `worker_departaments` WRITE;
/*!40000 ALTER TABLE `worker_departaments` DISABLE KEYS */;
/*!40000 ALTER TABLE `worker_departaments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workers`
--

DROP TABLE IF EXISTS `workers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `workers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kod` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstname` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `workers_kod_unique` (`kod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workers`
--

LOCK TABLES `workers` WRITE;
/*!40000 ALTER TABLE `workers` DISABLE KEYS */;
/*!40000 ALTER TABLE `workers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-05-14  0:09:19
