/**
 * Main JavaScript file
 *
 * @package     Tooltips
 * @version     1.0.0
 *
 * @author      Peter van Westen <peter@nonumber.nl>
 * @link        http://www.nonumber.nl
 * @copyright   Copyright © 2011 NoNumber! All Rights Reserved
 * @license     http://www.gnu.org/licenses/gpl-2.0.html GNU/GPL
 */

function tooltips_init( tip ) {
	tip.setStyle('display','block');
	if ( typeof( tip.fade_in ) == 'undefined' ) {
		tip.fade_in = new Fx.Styles( tip, { 'duration' : tooltips_fade_in_speed } );
	}
	if ( typeof( tip.fade_out ) == 'undefined' ) {
		tip.fade_out = new Fx.Styles( tip, { 'duration' : tooltips_fade_out_speed } );
	}
	tip.fade_in.stop();
	tip.fade_out.stop();
}
function tooltips_show( tip ) {
	if(		( tip.getElement('img') && tip.getElement('img').getStyle('width').toInt() > tooltips_max_width )
		||	( tip.getElement('table') && tip.getElement('table').getStyle('width').toInt() > tooltips_max_width )
	) {
		tip.getChildren()[0].setStyle('max-width','none');
	} else {
		tip.getChildren()[0].setStyle('max-width',tooltips_max_width);
	}
	tooltips_init( tip );
	tip.fade_in.start( { 'opacity' : 1 } );
}
function tooltips_hide( tip ) {
	tooltips_init( tip );
	tip.fade_out.start( { 'opacity' : 0 } );
}