<?php
	require_once("includes/pagehit.php");
	require_once("includes/for_googlebot.php");
?>
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no" /> 
    <meta name="fragment" content="!" />
<?php 
if (isset($for_gbot)) {
	fillPageTitle();
	fillPageDesc();
} else { 
?>
    <meta name="description" content="Practise and test your memorisation of Japanese hiragana and katakana characters and their pronunciations using the drills on this site." />
	<title>Nihongo Drills | Japanese Hiragana and Katakana Tests and Quiz</title>
<?php 
} 
?>
    <meta name="keywords" content="japanese,nihongo,practise,drill,memorise,pronounce,speak,learn" />
	<meta property="og:title" content="Nihongo Drills" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="http://www.nihongodrills.com" />
	<meta property="og:image" content="http://www.nihongodrills.com/res/images/favicon.gif" />
	<meta property="og:site_name" content="Nihongo Drills" />
	<meta property="fb:app_id" content="279700025395628" />

    <link rel="shortcut icon" href="res/images/favicon.gif" />
    <link rel="stylesheet" href="style/common.css" media="all"/>
    <link rel="stylesheet" href="style/desktop.css" media="screen and (min-width: 1024px)" />
    <script type="text/javascript" src="script/common.js"></script>
    <script type="text/javascript" src="script/image.js"></script>
    <script type="text/javascript" src="script/page.js"></script>
    <script type="text/javascript" src="script/page-manager.js"></script>
    <script type="text/javascript" src="script/abstract-modules.js"></script>
    <script type="text/javascript" src="script/modules.js"></script>
    <script type="text/javascript" src="script/main.js"></script>
</head>
<body>
	<header id="layout-top" class="dark-panel">
		<a href="#!/" id="header-title">「&nbsp;nihongo / にほんご / japanese&nbsp;」&nbsp;&nbsp; drills</a>
		<div id="header-links">

			<iframe src="//www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.nihongodrills.com&amp;send=false&amp;layout=standard&amp;width=49&amp;show_faces=false&amp;action=like&amp;colorscheme=dark&amp;font&amp;height=35&amp;appId=279700025395628" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:49px; height:24px;" allowTransparency="true"></iframe>
			<a href="https://twitter.com/share" class="twitter-share-button" data-url="http://www.nihongodrills.com" data-text="Practising my hiragana knowledge at " data-count="none" data-via="nihongo_drills" data-related="Angry_Tortoise"></a>
			<!-- Place this tag where you want the +1 button to render -->
			<g:plusone annotation="none" size="medium" width="100" href="http://www.nihongodrills.com"></g:plusone>
			<!-- Place this render call where appropriate -->
			<script type="text/javascript">
				if (window.JAP) {
				  JAP.util.addEvent(window, "load", function() {
					  var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
					  po.src = 'https://apis.google.com/js/plusone.js';
					  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);

					  po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
					  po.src = "//platform.twitter.com/widgets.js";
					  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
				  });
				}
			</script>
		</div>
	</header>
	<div id="layout-middle" class="color-change-anim">
		<?php fillPageContent(); ?>
	</div>
	<footer id="layout-bottom" class="dark-panel">
		<div id="footer-links" class="start" >
		<!--	<div class="footer-link-separator"></div>
			<a id="show-table-button" href="#!/">Table</a>
		-->	<div class="footer-link-separator"></div>
			<a href="#!/_links">Links</a>
			<div class="footer-link-separator"></div>
			<a href="#!/_about">About</a>
		</div>
		<nav id="footer-nav">
<?php
	if (isset($for_gbot)) {
		fillPageNav();
	}
?>
		</nav>
		<div id="footer-ad" class="">
			<script type="text/javascript"><!--
			google_ad_client = "ca-pub-2949063356844479";
			/* jap footer ad */
			google_ad_slot = "2866497396";
			google_ad_width = 468;
			google_ad_height = 15;
			//-->
			</script>
			<script type="text/javascript"
			src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
			</script>
		</div>
	</footer>
	<div id="screen-block" class="nothing">
	</div>
	<div id="char-table" class="nothing centred-X centred-Y">
	</div>

	<!--  NO JS -->
	<div id="no-js-message">
		<?php if (!isset($_REQUEST["_escaped_fragment_"])) { ?>
		<p>
			Nihongo Drills is an interactive website for testing, practising and drilling your knowledge of 
			the Kana characters fundamental to the Japanese language.
		</p>
		<p>
			Due to the interactivity, this site cannot function without Javascript.  You
			will need to either enable Javascript or download a browser that does support
			it.
		</p>
		<?php } ?>
	</div>
	<audio id="audio-cap-tester" class="nothing"></audio>
	<script type="text/javascript">
		document.getElementById("no-js-message").innerHTML = "Loading..";
	</script>
</body>
</html>
