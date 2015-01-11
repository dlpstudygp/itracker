/**
 * Author: Dee
 * Date: 2014/12/06
 * Version: 1.0.1 
 * Independence: - 
 *  
 * Description:
 * Build the DVM tree interface here
 * 						$
 * 						DVM
 * 			UTIL		DOCUMENT	IO		UI
 * 			...	...		...	...		...		LAYOUT	COMPONENTS
 * 											...		BAR		TOOLBOX		DIALOG		...	
 * 													...		...			...
 */

(function($)
{
	// Create DVM interface ... 
	window.console.log("Create the DVM tree interface ... ");
	
	$.DVM = 
	{
		UTIL : {},
		IO : {},
		DOC : {},
		UI :
		{
			LAYOUT : {},
			VIEW : {},
			COMPONENTS : 
			{
				BAR : {},
				DIALOG : {},
				PAGE : {},
				TOOLBOX : {}
			}
		}
	};

})(jQuery);