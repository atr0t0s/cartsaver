DROP TABLE IF EXISTS `#__cartsaver`;
CREATE TABLE `#__cartsaver` (
	`id` int(11) unsigned NOT NULL auto_increment,
	`user_id` int(11) unsigned NOT NULL,
	`product_id` int(11) unsigned NOT NULL,
	`quantity` int(11) unsigned NOT NULL,		`description` varchar(400),		`customer_note` varchar(255),	PRIMARY KEY (`id`)
)ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=0;