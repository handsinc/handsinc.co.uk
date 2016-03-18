<?php

defined('_JEXEC') or die('Restricted access');

$moduleInstanceId = $module->id;

// Variables
$now                 = date('Y-m-d H:i:s');
$database            = &JFactory::getDBO();
$nullDate            = $database->getNullDate();
$containerTagId = "mod_imageshowcase_containerTagId_".$moduleInstanceId;
$imageIdPrefix = "mod_imageshowcase_imageIdPrefix_".$moduleInstanceId;
$divIdPrefix = "mod_imageshowcase_divIdPrefix_".$moduleInstanceId;

// Parameters
$include_js = intval($params->get('include_js', 1));
$images_path = $params->get('images_path', 'modules/mod_imageshowcase/testimages/');
$transition_time = $params->get('transition_time', 1500);
$delay_time = $params->get('delay_time', 5000);
$web_links_catid = intval($params->get('web_links_catid', ''));
$default_link = $params->get('default_link', '');
$containerWidth = $params->get('container_width', '');
$containerHeight = $params->get('container_height', '');
$startImage = $params->get('start_image', 'first');
$imageOrder = $params->get('image_order', 'forward');
$pingPong = $params->get('ping_pong', '0');
$imageScaleMode = $params->get('image_scale_mode', 'fit_both');
$imageVerticalAlign = $params->get('image_vertical_align', 'center');
$imageHorizontalAlign = $params->get('image_horizontal_align', 'center');
$delayImageLoading = intval($params->get('delay_image_loading', 0));
$playCount = intval($params->get('play_count', 0));
$imageExtensions = array('jpg', 'gif', 'png', 'bmp');

if(substr($images_path, -1, 1) != "/") { $images_path = $images_path."/"; }
$webLinkRows = null;
if($web_links_catid)
{
	$query = 
			'SELECT title, '.
			'	id, '.
			'	description, '.
			'	params '.
			'FROM #__weblinks '.
			'WHERE catid = '.$web_links_catid.' '.
			'ORDER BY ordering';
	$database->setQuery($query);
	$webLinkRows = $database->loadObjectList();
}

echo "<link href=\"".JURI::base()."/modules/mod_imageshowcase/mod_imageshowcase.css\" rel=\"stylesheet\" type=\"text/css\" />\n";

$style = '';
if($containerHeight)
{
	if(!strstr($containerHeight, '%') && !strstr($containerHeight, 'px'))
	{
		$containerHeight .= 'px';
	}

	$style .= 'height: '.$containerHeight.';';
}
if($containerWidth)
{
	if(!strstr($containerWidth, '%') && !strstr($containerWidth, 'px'))
	{
		$containerWidth .= 'px';
	}

	$style .= 'width: '.$containerWidth.';';
}

echo "<div style=\"".$style."\" class=\"mod_imageshowcase_container\" id=\"" . $containerTagId . "\">\n";

$domreadyScript = "";
$index = 0;
// Open a known directory, and proceed to read its contents
if (is_dir($images_path))
{
	if ($dh = opendir($images_path))
	{
		$files = array();
		while (($file = readdir($dh)) !== false) 
		{
			array_push($files, $file);
		}

		sort($files);

		foreach($files as $file)
		{
			$extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
			if(is_file($images_path . $file) && in_array($extension, $imageExtensions))
			{
				$alt = "";
				$prefix = "";
				$postfix = "";
				if($webLinkRows && $index < count($webLinkRows))
				{
					$alt = htmlspecialchars($webLinkRows[$index]->title." - ".$webLinkRows[$index]->description);
					$link = "./index.php?option=com_weblinks&view=weblink&id=".$webLinkRows[$index]->id;
					$itemParams = new JParameter($webLinkRows[$index]->params);
					switch ($itemParams->get('target', $params->get('target')))
					{
						case 1:
							// open in a new window
							$prefix = "<a target=\"_blank\" href=\"".$link."\">\n";
							break;

						case 2:
							// open in a popup window
							$prefix = "<a href=\"#\" onclick=\"javascript: window.open('". $link ."', '', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=550'); return false;\">\n";
							break;

						default:
							// formerly case 2
							// open in parent window
							$prefix = "<a href=\"".$link."\">\n";
							break;
					}
					$postfix = "</a>\n";
				}
				else if($default_link != '')
				{
					$prefix = "<a target=\"_blank\" href=\"".$default_link."\">\n";
					$postfix = "</a>\n";
				}
				$fullImagePath = JURI::base()."/" . $images_path . $file;
				$divcontent = $prefix."<img id=\"" . $imageIdPrefix . $index . "\" class=\"mod_imageshowcase_image\" src=\"". ($delayImageLoading ? "" : $fullImagePath) . "\" title=\"".$alt."\" />\n".$postfix."<br />\n";
				if($delayImageLoading)
				{
					$domreadyScript .= "$('".$imageIdPrefix.$index."').src = \"".$fullImagePath."\";\n";
				}
				// We start out with opacity of zero so we don't see images loading.
				echo "<div style=\"opacity: 0; filter: alpha(opacity = 0)\" id=\"" . $divIdPrefix . $index . "\" class=\"mod_imageshowcase_div mod_imageshowcase_div_".$moduleInstanceId."\">\n".$divcontent."</div>\n";

				$index++;
			}
		}

		if($index == 0)
		{
			echo "Path: \"" . $images_path . "\" does not contain images.  Check to make sure files with the appropriate extensions exist in the path.<br />\n";
		}
		closedir($dh);
	}
}
else
{
	echo "Path: \"" . $images_path . "\" does not exist<br />\n";
}

echo "</div>\n";

if($include_js)
{
	echo "<script language=\"javascript\" type=\"text/javascript\" src=\"".JURI::base()."/modules/mod_imageshowcase/mootools-release-1.11.js\"></script>\n";
}
echo 
	"<script language=\"javascript\" type=\"text/javascript\">\n".
	"var praiseShowStartImage_".$moduleInstanceId." = '".$startImage."';\n".
	"var praiseShowImageOrder_".$moduleInstanceId." = '".$imageOrder."';\n".
	"var praiseShowPingPong_".$moduleInstanceId." = ".$pingPong.";\n".
	"var praiseShowImageCount_".$moduleInstanceId." = ".$index.";\n".
	"var praiseShowFxs_".$moduleInstanceId." = new Array();\n".
	"var praiseShowCurrentImageIndex_".$moduleInstanceId.";\n".
	"var praiseShowPlayCount_".$moduleInstanceId." = ".$playCount.";\n".
	"var praiseShowCurrentPlayCount_".$moduleInstanceId." = 0;\n".
	"if(praiseShowStartImage_".$moduleInstanceId." == 'random')\n".
	"{\n".
	"	praiseShowCurrentImageIndex_".$moduleInstanceId." = Math.floor(Math.random()*praiseShowImageCount_".$moduleInstanceId.");\n".
	"}\n".
	"else if(praiseShowStartImage_".$moduleInstanceId." == 'last_seen')\n".
	"{\n".
	"	praiseShowCurrentImageIndex_".$moduleInstanceId." = Cookie.get('praiseShowLastIndex_".$moduleInstanceId."');\n".
	"	if(!praiseShowCurrentImageIndex_".$moduleInstanceId.") { praiseShowCurrentImageIndex_".$moduleInstanceId." = 0; }\n".
	"}\n".
	"else if(praiseShowImageOrder_".$moduleInstanceId." == 'backward')\n".
	"{\n".
	"	praiseShowCurrentImageIndex_".$moduleInstanceId." = praiseShowImageCount_".$moduleInstanceId." - 1;\n".
	"}\n".
	"else\n".
	"{\n".
	"	praiseShowCurrentImageIndex_".$moduleInstanceId." = 0;\n".
	"}\n".
	"window.addEvent('domready',function() {\n".
	$domreadyScript.
	"});\n".
	"window.addEvent('load',function() {\n".
	"	var coords = $('".$containerTagId."').getCoordinates();\n".
	"	var elImage;\n".
	"	var elImageCoords;\n".
	"	$$('.mod_imageshowcase_div_".$moduleInstanceId."').each(function(el, i)\n".
	"	{\n".
	"		elImage = el.getElement('.mod_imageshowcase_image');\n";
	
if($imageScaleMode == "fit_both" || $imageScaleMode == "fit_height")
{
	echo "			elImage.setStyle('height', coords.height + 'px');\n";
}
if($imageScaleMode == "fit_both" || $imageScaleMode == "fit_width")
{
	echo "			elImage.setStyle('width', coords.width + 'px');\n";
}

if($imageScaleMode != "fit_both")
{
	switch($imageVerticalAlign)
	{
		case "top":
			$jsVerticalAlignText = "0";
			break;
		case "center":
			$jsVerticalAlignText = "(coords.height/2 - elImageCoords.height/2)";
			break;
		case "bottom":
		default:
			$jsVerticalAlignText = "(coords.height - elImageCoords.height)";
			break;
	}
	switch($imageHorizontalAlign)
	{
		case "left":
			$jsHorizontalAlignText = "0";
			break;
		case "center":
			$jsHorizontalAlignText = "(coords.width/2 - elImageCoords.width/2)";
			break;
		case "right":
		default:
			$jsHorizontalAlignText = "(coords.width - elImageCoords.width)";
			break;
	}
	echo
		"		elImageCoords = elImage.getCoordinates();\n".
		"		elImage.setStyle('left', ".$jsHorizontalAlignText." + 'px');\n".
		"		elImage.setStyle('top', ".$jsVerticalAlignText." + 'px');\n";
}
echo 
	"		if(i == praiseShowCurrentImageIndex_".$moduleInstanceId.") { el.setStyle('opacity', 1); }\n".
	"		else { el.setStyle('opacity', 0); }\n".
 	"		praiseShowFxs_".$moduleInstanceId."[i] = new Fx.Style(el, 'opacity', {\n".
	"			wait: false,\n".
	"			duration: " . $transition_time . ",\n".
	"			transition: Fx.Transitions.Quart.easeInOut\n".
	"		});\n".
	"	});\n".
	"	switchImage_".$moduleInstanceId.".periodical(" . ($delay_time + $transition_time) . ");\n".
	"});\n".
	"var switchImage_".$moduleInstanceId." = function()\n".
	"{\n".
	"	var nextImageIndex = praiseShowCurrentImageIndex_".$moduleInstanceId.";\n".
	"	switch(praiseShowImageOrder_".$moduleInstanceId.")\n".
	"	{\n".
	"		case 'random':\n".
	"			while(nextImageIndex == praiseShowCurrentImageIndex_".$moduleInstanceId." && praiseShowImageCount_".$moduleInstanceId." > 0)\n".
	"			{\n".
	"				nextImageIndex = Math.floor(Math.random()*praiseShowImageCount_".$moduleInstanceId.");\n".
	"			}\n".
	"			break;\n".
	"		case 'backward':\n".
	"			nextImageIndex = praiseShowCurrentImageIndex_".$moduleInstanceId." - 1;\n".
	"			if(nextImageIndex < 0) {\n".
	"				if(praiseShowPingPong_".$moduleInstanceId.") {\n".
	"					praiseShowImageOrder_".$moduleInstanceId." = 'forward';\n".
	"					nextImageIndex = 1;\n".
	"					praiseShowCurrentPlayCount_".$moduleInstanceId."++;\n".
	"				} else {\n".
	"					nextImageIndex = praiseShowImageCount_".$moduleInstanceId." - 1;\n".
	"				}\n".
	"			}\n".
	"			break;\n".
	"		default:\n".
	"			nextImageIndex = praiseShowCurrentImageIndex_".$moduleInstanceId." + 1;\n".
	"			if(nextImageIndex >= praiseShowImageCount_".$moduleInstanceId.") {\n".
	"				if(praiseShowPingPong_".$moduleInstanceId.") {\n".
	"					praiseShowImageOrder_".$moduleInstanceId." = 'backward';\n".
	"					nextImageIndex = praiseShowImageCount_".$moduleInstanceId." - 2;\n".
	"					praiseShowCurrentPlayCount_".$moduleInstanceId."++;\n".
	"				} else {\n".
	"					nextImageIndex = 0;\n".
	"				}\n".
	"			}\n".
	"			break;\n".
	"	}\n".
	"	praiseShowCurrentPlayCount_".$moduleInstanceId."++;\n".
	"	if(praiseShowPlayCount_".$moduleInstanceId." == 0 || praiseShowCurrentPlayCount_".$moduleInstanceId." < praiseShowPlayCount_".$moduleInstanceId."*praiseShowImageCount_".$moduleInstanceId.") {\n".
	"		praiseShowFxs_".$moduleInstanceId."[praiseShowCurrentImageIndex_".$moduleInstanceId."].start(1, 0);\n".
	"		praiseShowFxs_".$moduleInstanceId."[nextImageIndex].start(0, 1);\n".
	"		praiseShowCurrentImageIndex_".$moduleInstanceId." = nextImageIndex;\n".
	"		Cookie.set('praiseShowLastIndex_".$moduleInstanceId."', praiseShowCurrentImageIndex_".$moduleInstanceId.");\n".
	"	}\n".
	"}\n".
	"</script>\n";

?>
