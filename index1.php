<?php
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
?>

<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" href="css/flottant.css">
		<title>UFAX TEAM</title>
	</head>
	<body>
		<center>
			<div class="container">
				<a href="https://github.com/Sanix-Darker">
					<img src="https://ufax24.com/wp-content/uploads/2021/06/LOGO-UFAx24-X12-1.png" style="border-radius: 100%;width:200px;"><br>
					UFAX TEAM
				</a>
				<h1>UFAX TEAM</h1>
				<p>This web Site is protected by UFAX TEAM-System PHP.</p>
			</div>
		</center>
	</body>
</html>
