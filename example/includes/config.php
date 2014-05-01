<?php


$pages = array(
	'A' => array(
		'id' => 'A',
		'title' => 'Page A',
		'image' => 'http://i0.kym-cdn.com/photos/images/original/000/581/567/bab.jpg',
		'children' => array(
			'A.A' => array(
				'id' => 'A.A',
				'title' => 'Page A.A',
				'image' => 'http://atlantablackstar.com/wp-content/uploads/2012/11/donald-trump.jpg',
				'children' => array(
					'A.A.A' => array(
						'id' => 'A.A.A',
						'title' => 'Page A.A.A',
						'image' => 'http://images.lpcdn.ca/641x427/201211/26/615376-sonia-vachon.jpg',
					),
					'A.A.B' => array(
						'id' => 'A.A.B',
						'title' => 'Page A.A.B',
						'image' => 'http://images.lpcdn.ca/641x427/201207/17/528353.jpg',
					),
					'A.A.C' => array(
						'id' => 'A.A.C',
						'title' => 'Page A.A.C',
						'image' => 'http://www.northernstars.ca/actorsvz/media/vachon_sonia_lrg.jpg',
					),
				),
			),
			'A.B' => array(
				'id' => 'A.B',
				'title' => 'Page A.B',
				'image' => 'http://media.heavy.com/media/2011/10/Donald-Trump-Bad-Hair-Photo-1-1.jpg',
			),
			'A.C' => array(
				'id' => 'A.C',
				'title' => 'Page A.C',
				'image' => 'http://i.huffpost.com/gen/1105758/thumbs/o-DONALD-TRUMP-facebook.jpg',
			),
		),
	),
	'B' => array(
		'id' => 'B',
		'title' => 'Page B',
		'image' => 'http://static02.mediaite.com/geekosystem/uploads/2013/12/doge.jpg',
		'children' => array(
			'B.A' => array(
				'id' => 'B.A',
				'title' => 'Page B.A',
				'image' => 'http://genieinablog.com/wp-content/uploads/2014/01/busy042511.jpg',
			),
			'B.B' => array(
				'id' => 'B.B',
				'title' => 'Page B.B',
				'image' => 'http://realitytvsting.com/wp-content/uploads/2013/04/Gary+Busey+zc8fT8iuM0Hm.jpg',
			),
			'B.C' => array(
				'id' => 'B.C',
				'title' => 'Page B.C',
				'image' => 'http://media.star1015.com/images/110325_gary_busey.jpg',
			),
		),
	),
	'C' => array(
		'id' => 'C',
		'title' => 'Page C',
		'image' => 'http://static02.mediaite.com/geekosystem/uploads/2013/12/time.jpg',
	),
	'D' => array(
		'id' => 'D',
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
	$idx = isset($_GET['lev'][$level]) ? $_GET['lev'][$level] : 'A';
	if(isset($currentChildren[$idx])) {
		$activeLevels[$level] = $currentChildren[$idx];
		//$activeLevels[$level]['id'] = $idx;
		$currentPage = $currentChildren[$idx];
		$currentChildren = $currentChildren[$idx]['children'];
		$link .= ($link ? '&' : '') . 'lev['.$level.']='.$currentPage['id'];
	}
	$level++;

} while(isset($_GET['lev'][$level]));

$link = 'index.php?' . $link; 

//echo'<pre>';print_r($activeLevels);echo'</pre>';
