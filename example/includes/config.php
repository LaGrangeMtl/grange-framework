<?php


$pages = array(
	array(
		'title' => 'Page A',
		'image' => 'http://i0.kym-cdn.com/photos/images/original/000/581/567/bab.jpg',
		'children' => array(
			array(
				'title' => 'Page A.A',
				'image' => 'http://atlantablackstar.com/wp-content/uploads/2012/11/donald-trump.jpg',
				'children' => array(
					array(
						'title' => 'Page A.A.A',
						'image' => 'http://images.lpcdn.ca/641x427/201211/26/615376-sonia-vachon.jpg',
					),
					array(
						'title' => 'Page A.A.B',
						'image' => 'http://images.lpcdn.ca/641x427/201207/17/528353.jpg',
					),
					array(
						'title' => 'Page A.A.C',
						'image' => 'http://www.northernstars.ca/actorsvz/media/vachon_sonia_lrg.jpg',
					),
				),
			),
			array(
				'title' => 'Page A.B',
				'image' => 'http://media.heavy.com/media/2011/10/Donald-Trump-Bad-Hair-Photo-1-1.jpg',
			),
			array(
				'title' => 'Page A.C',
				'image' => 'http://i.huffpost.com/gen/1105758/thumbs/o-DONALD-TRUMP-facebook.jpg',
			),
		),
	),
	array(
		'title' => 'Page B',
		'image' => 'http://static02.mediaite.com/geekosystem/uploads/2013/12/doge.jpg',
		'children' => array(
			array(
				'title' => 'Page B.A',
				'image' => 'http://genieinablog.com/wp-content/uploads/2014/01/busy042511.jpg',
			),
			array(
				'title' => 'Page B.B',
				'image' => 'http://realitytvsting.com/wp-content/uploads/2013/04/Gary+Busey+zc8fT8iuM0Hm.jpg',
			),
			array(
				'title' => 'Page B.C',
				'image' => 'http://media.star1015.com/images/110325_gary_busey.jpg',
			),
		),
	),
	array(
		'title' => 'Page C',
		'image' => 'http://static02.mediaite.com/geekosystem/uploads/2013/12/time.jpg',
	),
	array(
		'title' => 'Page D',
		'image' => 'http://3.bp.blogspot.com/-MBqqFX_-6EQ/Unhsr0Ojm5I/AAAAAAAAAIY/J5sg1SY31AM/s1600/So+much+doge+_2ec24532e24abb4835551a2f6d29116c.jpg',
	),
	
);

$activeLevels = array();
$currentPage = null;
$currentChildren = $pages;
$level = 0;
$link = '';
do {
	$idx = isset($_GET['lev'][$level]) ? $_GET['lev'][$level] : 0;
	if(isset($currentChildren[$idx])) {
		$activeLevels[$level] = $currentChildren[$idx];
		$activeLevels[$level]['id'] = $idx;
		$currentPage = $currentChildren[$idx];
		$currentChildren = $currentChildren[$idx]['children'];
		$link .= ($link ? '&' : '') . 'lev['.$level.']='.$idx;
	}
	$level++;

} while(isset($_GET['lev'][$level]));

$link = 'index.php?' . $link; 

//echo'<pre>';print_r($activeLevels);echo'</pre>';
