-- MySQL dump 10.13  Distrib 5.6.24, for Win32 (x86)
--
-- Host: localhost    Database: new
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
-- Table structure for table `client_translations`
--

DROP TABLE IF EXISTS `client_translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_translations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` int(10) unsigned NOT NULL,
  `locale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contacts` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `client_translations_client_id_locale_unique` (`client_id`,`locale`),
  KEY `client_translations_locale_index` (`locale`),
  CONSTRAINT `client_translations_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_translations`
--

LOCK TABLES `client_translations` WRITE;
/*!40000 ALTER TABLE `client_translations` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_translations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kod` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clients_id_unique` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `components`
--

LOCK TABLES `components` WRITE;
/*!40000 ALTER TABLE `components` DISABLE KEYS */;
/*!40000 ALTER TABLE `components` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departament_translations`
--

DROP TABLE IF EXISTS `departament_translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `departament_translations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `departament_id` int(10) unsigned NOT NULL,
  `locale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `departament_translations_departament_id_locale_unique` (`departament_id`,`locale`),
  KEY `departament_translations_locale_index` (`locale`),
  CONSTRAINT `departament_translations_departament_id_foreign` FOREIGN KEY (`departament_id`) REFERENCES `departaments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=166 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departament_translations`
--

LOCK TABLES `departament_translations` WRITE;
/*!40000 ALTER TABLE `departament_translations` DISABLE KEYS */;
INSERT INTO `departament_translations` VALUES (1,1,'pl','Produkcja'),(2,1,'en','Manufacturing'),(3,1,'ua','Виробництво'),(4,1,'ru','Производство'),(5,2,'pl','Transport'),(6,2,'en','Transporting'),(7,2,'ua','Перевезення'),(8,2,'ru','Перевозки'),(9,3,'pl','Przygotowanie'),(10,3,'en','Preparing'),(11,3,'ua','Приготування'),(12,3,'ru','Приготовление'),(13,4,'pl','Wykonczenie'),(14,4,'en','Finish'),(15,4,'ua','Закінчення'),(16,4,'ru','Окончание'),(17,5,'pl','Title pl'),(18,5,'en','Title en'),(19,5,'ua','Title ua'),(20,5,'ru','Title ru'),(21,6,'pl','Title pl'),(22,6,'en','Title en'),(23,6,'ua','Title ua'),(24,6,'ru','Title ru'),(25,7,'pl','Title pl'),(26,7,'en','Title en'),(27,7,'ua','Title ua'),(28,7,'ru','Title ru'),(29,8,'pl','Title pl'),(30,8,'en','Title en'),(31,8,'ua','Title ua'),(32,8,'ru','Title ru'),(143,38,'pl','yyyyy'),(144,39,'pl','oiuiouoi'),(149,43,'pl','k;okpok'),(150,44,'pl','k;okpok'),(151,44,'en','jlkjlk'),(152,45,'pl','lkljkl'),(153,45,'en','klj;ljk;l'),(164,52,'pl','qwerty'),(165,52,'en','qwerty-en');
/*!40000 ALTER TABLE `departament_translations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departaments`
--

DROP TABLE IF EXISTS `departaments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `departaments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `departament_id_idx` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departaments`
--

LOCK TABLES `departaments` WRITE;
/*!40000 ALTER TABLE `departaments` DISABLE KEYS */;
INSERT INTO `departaments` VALUES (1,0,NULL,NULL),(2,0,NULL,NULL),(3,0,NULL,NULL),(4,0,NULL,NULL),(5,1,'2019-05-31 13:38:23','2019-05-31 13:38:23'),(6,1,'2019-05-31 13:49:05','2019-05-31 13:49:05'),(7,1,'2019-05-31 14:13:58','2019-05-31 14:13:58'),(8,1,'2019-05-31 14:14:26','2019-05-31 14:14:26'),(38,1,'2019-05-31 19:54:27','2019-05-31 19:54:27'),(39,1,'2019-05-31 19:54:42','2019-05-31 19:54:42'),(43,2,'2019-05-31 19:55:51','2019-05-31 19:55:51'),(44,2,'2019-05-31 19:55:58','2019-05-31 19:55:58'),(45,3,'2019-05-31 19:56:16','2019-05-31 19:56:16'),(52,0,'2019-06-02 08:18:02','2019-06-02 08:18:02');
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
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_000000_create_users_table',1),(2,'2014_10_12_100000_create_password_resets_table',1),(3,'2016_06_01_000001_create_oauth_auth_codes_table',1),(4,'2016_06_01_000002_create_oauth_access_tokens_table',1),(5,'2016_06_01_000003_create_oauth_refresh_tokens_table',1),(6,'2016_06_01_000004_create_oauth_clients_table',1),(7,'2016_06_01_000005_create_oauth_personal_access_clients_table',1),(8,'2019_05_10_201801_create_roles_table',1),(9,'2019_05_10_202039_create_users_roles_table',1),(10,'2019_05_10_202447_create_permissions_table',1),(11,'2019_05_10_202802_create_roles_permissions_table',1),(12,'2019_05_10_203303_create_workers_table',1),(13,'2019_05_10_203518_create_departaments_table',1),(14,'2019_05_10_203717_create_worker_departaments_table',1),(15,'2019_05_10_203925_create_clients_table',1),(16,'2019_05_10_204659_create_product_types_table',1),(17,'2019_05_10_205841_create_product_groups_table',1),(18,'2019_05_10_210542_create_products_table',1),(19,'2019_05_10_211322_create_components_table',1),(20,'2019_05_10_211806_create_orders_table',1),(21,'2019_05_10_212427_create_orders_positions_table',1),(22,'2019_05_10_212650_create_statuses_table',1),(23,'2019_05_10_212839_create_tasks_groups_table',1),(24,'2019_05_10_213041_create_orders_history_table',1),(25,'2019_05_10_220107_create_tasks_table',1),(26,'2019_05_10_220453_create_warehouse_table',1),(27,'2019_05_10_220739_create_product_groups_tasks_table',1),(28,'2019_05_10_221537_create_product_tasks_table',1),(29,'2019_05_12_192012_create_operations_table',1),(30,'2019_05_13_181943_add_product_id_orders_positions',1),(31,'2019_05_15_174700_change_users_table',1),(32,'2019_05_16_081922_add_api_token_column_to_users',1),(33,'2019_05_22_124239_add_columns_to_tasks',1),(34,'2019_05_22_125447_add_columns_to_product_groups_tasks_table',1),(35,'2019_05_22_165715_drop_foreign_key_in_worker_departaments_table',1),(36,'2019_05_22_172605_rename_worker_id_worker_departaments_table',1),(37,'2019_05_22_172750_add_foreign_key_user_id_worker_departaments_table',1),(38,'2019_05_22_173302_drop_foreign_key_in_operations',1),(39,'2019_05_22_173415_rename_worker_id_operations_table',1),(40,'2019_05_22_173527_add_foreign_key_user_id_operations_table',1),(41,'2019_05_22_173620_delete_workers_table',1),(42,'2019_05_22_173753_add_is_worker_field_to_users_table',1),(43,'2019_05_25_082044_create_departament_translations_table',1),(44,'2019_05_27_065147_create_order_translations_table',1),(45,'2019_05_27_073139_create_task_group_translations_table',1),(46,'2019_05_27_075546_create_product_type_translations_table',1),(47,'2019_05_27_080524_create_product_group_translations_table',1),(48,'2019_05_27_115616_create_permissions_translations_table',1),(49,'2019_05_27_120727_create_role_translations_table',1),(50,'2019_05_27_123611_create_status_translations_table',1),(51,'2019_05_27_133829_create_product_translations_table',1),(52,'2019_05_27_140623_create_client_translations_table',1),(53,'2019_05_28_151735_drop_columns_at_clients_table',2),(54,'2019_05_28_152059_drop_columns_at_departaments_table',3),(55,'2019_05_28_152718_drop_columns_at_orders_table',4),(56,'2019_05_28_152847_drop_columns_at_permissions_table',5),(57,'2019_05_28_153008_drop_columns_at_product_groups_table',6),(58,'2019_05_28_153152_drop_columns_at_products_table',7),(59,'2019_05_28_153347_drop_columns_at_product_types_table',8),(60,'2019_05_28_153517_drop_columns_at_roles_table',9),(61,'2019_05_28_153623_drop_columns_at_statuses_table',10),(62,'2019_05_28_153757_drop_columns_at_tasks_groups_table',11);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_access_tokens`
--

DROP TABLE IF EXISTS `oauth_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth_access_tokens` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `client_id` int(10) unsigned NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_access_tokens_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_access_tokens`
--

LOCK TABLES `oauth_access_tokens` WRITE;
/*!40000 ALTER TABLE `oauth_access_tokens` DISABLE KEYS */;
INSERT INTO `oauth_access_tokens` VALUES ('0cb0617883af88c9b98a7fe98b5fbe59b0acdf20fe51c527b16b2265f63d461f622feb1bdf26fbc8',2,1,'MyApp','[]',0,'2019-06-01 18:37:50','2019-06-01 18:37:50','2019-12-01 21:37:49'),('1b8d8afc8e6c845f4bed443041cc4d94160104e1bcb95c3827d6dfae88aa8a25199f4de5a032699d',4,1,'MyApp','[]',0,'2019-06-03 06:46:24','2019-06-03 06:46:24','2019-12-03 09:46:23'),('1c5cdd9a42271b885ce125f2a4271b37658d74d1b61a6679250c2e66fa67981ec79a6217b97d7079',4,1,'MyApp','[]',0,'2019-06-03 06:46:50','2019-06-03 06:46:50','2019-12-03 09:46:50'),('1def8b83619961c6e9bca4b4865cf9d8f833d072a13c7623a04c0533d5058ed26ef8f70dbf807dc0',2,1,'MyApp','[]',0,'2019-06-01 15:37:49','2019-06-01 15:37:49','2019-12-01 18:37:45'),('1f3b34e9cb8e4c989dae07db39908fd2c6ceacbb8ccf95b0a084ef35bcab10e3286f3f8a781ae415',3,1,'MyApp','[]',0,'2019-06-03 05:40:05','2019-06-03 05:40:05','2019-12-03 08:40:04'),('1fb7d1ad1b5f3118c40b11ecd011417595e5eee6e50e1495df48b38438496bcb0085e277553d9d09',2,1,'MyApp','[]',0,'2019-05-28 03:54:16','2019-05-28 03:54:16','2019-11-28 06:54:10'),('2ab1b31e0a881ca8b76fc6b3c3b68a0f0be0b25feb26be5af25a0b991dd5ddc1a7d6e005805e3fee',2,1,'MyApp','[]',0,'2019-06-01 06:29:15','2019-06-01 06:29:15','2019-12-01 09:29:15'),('4a42ce05e5720b86f43ad5dcb2031bb784fd20f21d204a10dab2a44df125c3188b895b2c5c02fd96',2,1,'MyApp','[]',0,'2019-06-03 01:03:47','2019-06-03 01:03:47','2019-12-03 04:03:46'),('662bc1014000fc062b18d55f058675a1db632429e1e367dae21a7089b8646a966327f740f8076d7e',3,1,'MyApp','[]',0,'2019-06-03 05:38:45','2019-06-03 05:38:45','2019-12-03 08:38:42'),('6dc3f08d4f2f4d112c5f22e2b3a17838ee2e9ba28208d8e412b49afbf18fca856a6b8fc1b88d51bc',2,1,'MyApp','[]',0,'2019-06-02 17:07:07','2019-06-02 17:07:07','2019-12-02 20:07:06'),('74d189be3d48a59175ced4984de386e35cde2136fecc85324b266dfa65fe30de7feef199d017c5db',2,1,'MyApp','[]',0,'2019-06-03 06:15:49','2019-06-03 06:15:49','2019-12-03 09:15:49'),('78efa6fe2397294dd8aeef82242acdda3deab1be63d5d3644cfb03fb01767a43514b4444c7284ed3',2,1,'MyApp','[]',0,'2019-06-01 06:28:12','2019-06-01 06:28:12','2019-12-01 09:28:12'),('958fca30a53ca1276f59ae49cc7a3e142d7971153e36a952685b9f6e34b9d6edf1c948edfc43cfbb',2,1,'MyApp','[]',0,'2019-06-02 03:37:02','2019-06-02 03:37:02','2019-12-02 06:37:01'),('d06de2c8bd4c96e64ed4bfed64930075793e03aeafa2a361c9901c4d4100e0ed9e469f12675926e5',2,1,'MyApp','[]',0,'2019-05-27 14:01:42','2019-05-27 14:01:42','2019-11-27 17:01:41');
/*!40000 ALTER TABLE `oauth_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_auth_codes`
--

DROP TABLE IF EXISTS `oauth_auth_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth_auth_codes` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(11) NOT NULL,
  `client_id` int(10) unsigned NOT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_auth_codes`
--

LOCK TABLES `oauth_auth_codes` WRITE;
/*!40000 ALTER TABLE `oauth_auth_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth_auth_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_clients`
--

DROP TABLE IF EXISTS `oauth_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth_clients` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `secret` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `redirect` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `personal_access_client` tinyint(1) NOT NULL,
  `password_client` tinyint(1) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_clients_user_id_index` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_clients`
--

LOCK TABLES `oauth_clients` WRITE;
/*!40000 ALTER TABLE `oauth_clients` DISABLE KEYS */;
INSERT INTO `oauth_clients` VALUES (1,NULL,'Laravel Personal Access Client','6546iorJd3pEqCzGBbuURoJuTnHvPUcWhK6fR0ev','http://localhost',1,0,0,'2019-05-27 13:44:23','2019-05-27 13:44:23'),(2,NULL,'Laravel Password Grant Client','Fd1J5J9i7MBovRSgtZEfu9JR1VkkusQdZbcnUt6f','http://localhost',0,1,0,'2019-05-27 13:44:23','2019-05-27 13:44:23');
/*!40000 ALTER TABLE `oauth_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_personal_access_clients`
--

DROP TABLE IF EXISTS `oauth_personal_access_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth_personal_access_clients` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_personal_access_clients_client_id_index` (`client_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_personal_access_clients`
--

LOCK TABLES `oauth_personal_access_clients` WRITE;
/*!40000 ALTER TABLE `oauth_personal_access_clients` DISABLE KEYS */;
INSERT INTO `oauth_personal_access_clients` VALUES (1,1,'2019-05-27 13:44:23','2019-05-27 13:44:23');
/*!40000 ALTER TABLE `oauth_personal_access_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_refresh_tokens`
--

DROP TABLE IF EXISTS `oauth_refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `oauth_refresh_tokens` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_refresh_tokens_access_token_id_index` (`access_token_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oauth_refresh_tokens`
--

LOCK TABLES `oauth_refresh_tokens` WRITE;
/*!40000 ALTER TABLE `oauth_refresh_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `oauth_refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operations`
--

DROP TABLE IF EXISTS `operations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `operations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `order_position_id` int(10) unsigned NOT NULL,
  `task_id` int(10) unsigned NOT NULL,
  `amount` int(11) NOT NULL,
  `date_start` datetime NOT NULL,
  `date_end` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `operations_order_position_id_foreign` (`order_position_id`),
  KEY `operations_task_id_foreign` (`task_id`),
  KEY `operations_user_id_foreign` (`user_id`),
  CONSTRAINT `operations_order_position_id_foreign` FOREIGN KEY (`order_position_id`) REFERENCES `orders_positions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `operations_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `operations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
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
-- Table structure for table `order_translations`
--

DROP TABLE IF EXISTS `order_translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_translations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int(10) unsigned NOT NULL,
  `locale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_translations_order_id_locale_unique` (`order_id`,`locale`),
  KEY `order_translations_locale_index` (`locale`),
  CONSTRAINT `order_translations_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_translations`
--

LOCK TABLES `order_translations` WRITE;
/*!40000 ALTER TABLE `order_translations` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_translations` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders_history`
--

LOCK TABLES `orders_history` WRITE;
/*!40000 ALTER TABLE `orders_history` DISABLE KEYS */;
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
  KEY `orders_positions_product_id_foreign` (`product_id`),
  CONSTRAINT `orders_positions_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_positions_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders_positions`
--

LOCK TABLES `orders_positions` WRITE;
/*!40000 ALTER TABLE `orders_positions` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders_positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission_translations`
--

DROP TABLE IF EXISTS `permission_translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permission_translations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `permission_id` int(10) unsigned NOT NULL,
  `locale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permission_translations_permission_id_locale_unique` (`permission_id`,`locale`),
  KEY `permission_translations_locale_index` (`locale`),
  CONSTRAINT `permission_translations_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission_translations`
--

LOCK TABLES `permission_translations` WRITE;
/*!40000 ALTER TABLE `permission_translations` DISABLE KEYS */;
/*!40000 ALTER TABLE `permission_translations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
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
-- Table structure for table `product_group_translations`
--

DROP TABLE IF EXISTS `product_group_translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_group_translations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_group_id` int(10) unsigned NOT NULL,
  `locale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_group_translations_product_group_id_locale_unique` (`product_group_id`,`locale`),
  KEY `product_group_translations_locale_index` (`locale`),
  CONSTRAINT `product_group_translations_product_group_id_foreign` FOREIGN KEY (`product_group_id`) REFERENCES `product_groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_group_translations`
--

LOCK TABLES `product_group_translations` WRITE;
/*!40000 ALTER TABLE `product_group_translations` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_group_translations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_groups`
--

DROP TABLE IF EXISTS `product_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_groups` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_groups_parent_id_foreign` (`parent_id`),
  CONSTRAINT `product_groups_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `product_groups` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_groups`
--

LOCK TABLES `product_groups` WRITE;
/*!40000 ALTER TABLE `product_groups` DISABLE KEYS */;
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
  `for_order` tinyint(1) NOT NULL DEFAULT '0',
  `amount_start` int(11) DEFAULT NULL,
  `amount_stop` int(11) DEFAULT NULL,
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
-- Table structure for table `product_translations`
--

DROP TABLE IF EXISTS `product_translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_translations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `locale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pack` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_translations_product_id_locale_unique` (`product_id`,`locale`),
  KEY `product_translations_locale_index` (`locale`),
  CONSTRAINT `product_translations_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_translations`
--

LOCK TABLES `product_translations` WRITE;
/*!40000 ALTER TABLE `product_translations` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_translations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_type_translations`
--

DROP TABLE IF EXISTS `product_type_translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_type_translations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_type_id` int(10) unsigned NOT NULL,
  `locale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_type_translations_product_type_id_locale_unique` (`product_type_id`,`locale`),
  KEY `product_type_translations_locale_index` (`locale`),
  CONSTRAINT `product_type_translations_product_type_id_foreign` FOREIGN KEY (`product_type_id`) REFERENCES `product_types` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_type_translations`
--

LOCK TABLES `product_type_translations` WRITE;
/*!40000 ALTER TABLE `product_type_translations` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_type_translations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_types`
--

DROP TABLE IF EXISTS `product_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_types` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_types`
--

LOCK TABLES `product_types` WRITE;
/*!40000 ALTER TABLE `product_types` DISABLE KEYS */;
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
  `product_type_id` int(10) unsigned NOT NULL,
  `weight` double(8,2) NOT NULL,
  `height` int(11) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `length` int(11) DEFAULT NULL,
  `pictures` varchar(155) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_group_id` int(10) unsigned NOT NULL,
  `area` double(8,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_kod_unique` (`kod`),
  KEY `products_product_type_id_foreign` (`product_type_id`),
  KEY `products_product_group_id_foreign` (`product_group_id`),
  CONSTRAINT `products_product_group_id_foreign` FOREIGN KEY (`product_group_id`) REFERENCES `product_groups` (`id`),
  CONSTRAINT `products_product_type_id_foreign` FOREIGN KEY (`product_type_id`) REFERENCES `product_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_translations`
--

DROP TABLE IF EXISTS `role_translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role_translations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `role_id` int(10) unsigned NOT NULL,
  `locale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_translations_role_id_locale_unique` (`role_id`,`locale`),
  KEY `role_translations_locale_index` (`locale`),
  CONSTRAINT `role_translations_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_translations`
--

LOCK TABLES `role_translations` WRITE;
/*!40000 ALTER TABLE `role_translations` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_translations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
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
-- Table structure for table `status_translations`
--

DROP TABLE IF EXISTS `status_translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `status_translations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `status_id` int(10) unsigned NOT NULL,
  `locale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `status_translations_status_id_locale_unique` (`status_id`,`locale`),
  KEY `status_translations_locale_index` (`locale`),
  CONSTRAINT `status_translations_status_id_foreign` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_translations`
--

LOCK TABLES `status_translations` WRITE;
/*!40000 ALTER TABLE `status_translations` DISABLE KEYS */;
/*!40000 ALTER TABLE `status_translations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `statuses`
--

DROP TABLE IF EXISTS `statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `statuses` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `statuses`
--

LOCK TABLES `statuses` WRITE;
/*!40000 ALTER TABLE `statuses` DISABLE KEYS */;
/*!40000 ALTER TABLE `statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_group_translations`
--

DROP TABLE IF EXISTS `task_group_translations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `task_group_translations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `task_group_id` int(10) unsigned NOT NULL,
  `locale` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `task_group_translations_task_group_id_locale_unique` (`task_group_id`,`locale`),
  KEY `task_group_translations_locale_index` (`locale`),
  CONSTRAINT `task_group_translations_task_group_id_foreign` FOREIGN KEY (`task_group_id`) REFERENCES `tasks_groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_group_translations`
--

LOCK TABLES `task_group_translations` WRITE;
/*!40000 ALTER TABLE `task_group_translations` DISABLE KEYS */;
/*!40000 ALTER TABLE `task_group_translations` ENABLE KEYS */;
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
  `for_order` tinyint(1) NOT NULL DEFAULT '0',
  `amount_start` int(11) DEFAULT NULL,
  `amount_stop` int(11) DEFAULT NULL,
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
  `parent_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_groups_parent_id_foreign` (`parent_id`),
  CONSTRAINT `tasks_groups_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `tasks_groups` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks_groups`
--

LOCK TABLES `tasks_groups` WRITE;
/*!40000 ALTER TABLE `tasks_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `tasks_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `api_token` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `kod` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `login` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_worker` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_kod_unique` (`kod`),
  UNIQUE KEY `users_login_unique` (`login`),
  UNIQUE KEY `users_api_token_unique` (`api_token`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@mail.com',NULL,'$2y$10$ie.n57rzvzubI5NqGJqBquNI1bLFzfGpUd4S0qGPifl7IOJi9NtR6',NULL,NULL,NULL,NULL,'W00000','admin1','admin1','admin1',0),(2,'admin','adminadmin@mail.com',NULL,'$2y$10$D4xPxwaSu/SRe4ktJLONteK0lACFvYWBir1/vQlYoppiNBLqsNV.6','eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjFmYjdkMWFkMWI1ZjMxMThjNDBiMTFlY2Qw',NULL,'2019-05-27 14:01:41','2019-05-27 14:01:41','W00001','admin','admin','admin',1),(3,'admin3','admin3@mail.com',NULL,'$2y$10$J6dpNCOm/DwUPIWfyi1GK.Xy4jjR62P3guRYCmu4k9bzkF00Ehj8K',NULL,NULL,'2019-06-03 05:38:43','2019-06-03 05:38:43','W000002','admin3','admin3','admin3',1),(4,'admin4','admin4@mail.com',NULL,'$2y$10$uptVog142oyGpeO9IU/KnetYg0ERFvDCVOiXgjIQT3HM8L5jZdtFq',NULL,NULL,'2019-06-03 06:46:24','2019-06-03 06:46:24','admin4','admin4','admin4','admin4',0);
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
  `user_id` bigint(20) unsigned NOT NULL,
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
  `user_id` bigint(20) unsigned NOT NULL,
  `departament_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `worker_departaments_departament_id_foreign` (`departament_id`),
  KEY `worker_departaments_user_id_foreign` (`user_id`),
  CONSTRAINT `worker_departaments_departament_id_foreign` FOREIGN KEY (`departament_id`) REFERENCES `departaments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `worker_departaments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `worker_departaments`
--

LOCK TABLES `worker_departaments` WRITE;
/*!40000 ALTER TABLE `worker_departaments` DISABLE KEYS */;
INSERT INTO `worker_departaments` VALUES (1,1,1,NULL,NULL),(2,2,1,NULL,NULL),(3,1,2,NULL,NULL);
/*!40000 ALTER TABLE `worker_departaments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-03 12:52:33
