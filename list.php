<?php
	if($handle = opendir("levels/")) {
		$array = array();
		while(false !== ($file = readdir($handle))) {
			if(!is_dir($file)) {
				array_push($array, $file);
			}
		}
		echo(json_encode($array));
	}

?>
