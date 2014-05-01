
<?php if(isset($activeLevels[1]['children'])) { ?>

	<nav class="level2" data-parent="<?php echo $activeLevels[1]['id'] ?>"  data-level="2">
		<?php foreach($activeLevels[1]['children'] as $page) { 
			$id = $page['id'];
		?>

		    <a data-id="<?php echo $id; ?>" href="index.php?lev[0]=<?php echo $activeLevels[0]['id'] ?>&lev[1]=<?php echo $activeLevels[1]['id'] ?>&lev[2]=<?php echo $id ?>" class="<?php echo $_GET['lev'][2] == $id ? 'active' : '' ?>"><?php echo $page['title'] ?></a>
		<?php } ?>
	</nav>

<?php } ?>