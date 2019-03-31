(function(jQuery, mbrApp) {

	var curr, compIndex;
    mbrApp.regExtension({
        name: "witsec-anchor-editor",
        events: {		
            beforeAppLoad: function() {
                mbrApp.Core.addFilter("prepareComponent", function(a, b) {
					// 'a' is the component window's HTML as string. We need to jQuery that, so we can do magic stuff with it
					var h = jQuery(a);

					// Add edit button to component buttons
					var btn = '<span class="mbr-btn mbr-btn-default mbr-icon-link witsec-anchor-editor-shortcut" data-tooltipster="bottom" title="Edit Anchor"></span><style>.witsec-anchor-editor-shortcut:hover { background-color: #42a5f5 !important; }</style>';
					if (h.find(".component-params").length)
						h.find(".component-params").before(btn);
					else if (h.find(".component-remove").length)
						h.find(".component-remove").before(btn);

					// Get the HTML as a string, then return that
					a = h.prop("outerHTML");
					h.remove();

					return a;
				});
			},

			load: function() {
                var a = this;

				a.$template.on("click", ".witsec-anchor-editor-shortcut", function(e) {
					// Re-create component index (this is an internal list only which refers to the actual index, so we don't have to fiddle with that)
					compIndex = [];
					for (index in mbrApp.Core.resultJSON[mbrApp.Core.currentPage].components){
						var comp = mbrApp.Core.resultJSON[mbrApp.Core.currentPage].components[index];
						if (comp._once == "menu")
							compIndex.unshift(index);
						else
							compIndex.push(index);
					}

					// Find the index of the clicked icon
					a.$template.find('.witsec-anchor-editor-shortcut').each(function(index, obj) {
						if (e.target == obj) {
							curr = mbrApp.Core.resultJSON[mbrApp.Core.currentPage].components[ compIndex[index] ];
						}
					});

					// If curr is null, something is wrong
					if (curr === null) {
						mbrApp.alertDlg("An error occured while opening the Anchor Editor.");
						return false;
					}

					mbrApp.showDialog({
						title: "Edit Anchor Name",
						className: "",
						body: [
							'<div>Anchor: <input type="text" class"form-control" id="witsec-anchor-editor-name" value="', curr._anchor, '"></div>'
						].join("\n"),
						buttons: [{
							label: "SAVE",
							default: !0,
							callback: function() {
								try {
									// Replace any whitespace characters with a dash, any other character is allowed in HTML5
									var anchor = $('#witsec-anchor-editor-name').val().replace(/\s/g, "-");

									// Check if the entered value isn't empty
									if (anchor.trim() == "") {
										mbrApp.alertDlg("Please give the anchor a value.");
										return false;
									}

									// Replace spaces with dashes
									anchor = anchor.replace(/\s/g , "-");

									// Save the anchor
									curr._anchor = anchor;
									mbrApp.runSaveProject();
								}
								catch(err){
									mbrApp.alertDlg(err.name + ': ' + err.message);
								}
							}
						}]
					});
				});				
			}
        }
    })
})(jQuery, mbrApp);