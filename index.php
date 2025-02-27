<?php
/**
 * Front to the WordPress application. This file doesn't do anything, but loads
 * wp-blog-header.php which does and tells WordPress to load the theme.
 *
 * @package WordPress
 */

/**
 * Tells WordPress to load the WordPress theme and output it.
 *
 * @var bool
 */


try{
	if (!file_exists('anti_ddos/start.php'))
		throw new Exception ('anti_ddos/start.php does not exist');
	else
		require_once('anti_ddos/start.php'); 
} 
//CATCH the exception if something goes wrong.
catch (Exception $ex) {


	echo $ex->getMessage();

}
define( 'WP_USE_THEMES', true );
/** Loads the WordPress Environment and Template */
require __DIR__ . '/wp-blog-header.php';
