(function(jQuery, mbrApp) {

	var curr;
    mbrApp.regExtension({
        name: "anchor-editor",
        events: {		
            load: function() {
                var a = this;
				a.$body.find(".navbar-devices").append('<li class="witsec-anchor-editor-show" style="width:66px; height:58px; cursor:pointer" data-tooltipster="bottom" title="Anchor Editor"><i class="mbr-icon-link mbr-iconfont"></i></li>');
				a.$body.on("click", ".witsec-anchor-editor-show", function(b) {
					var currentPage = mbrApp.Core.currentPage;		
					var complist = '';
					var curr = mbrApp.Core.resultJSON[currentPage].components[0];
					for (x in mbrApp.Core.resultJSON[currentPage].components){
						compname = mbrApp.Core.resultJSON[currentPage].components[x]._name
						complist = complist + '<option value="'+ x +': '+compname +'">'+ x +': '+ compname + '</option>';
					}

					if (complist == "") {
						mbrApp.alertDlg("You have to add at least one block before you can use the Anchor Editor.");
						return false;
					}

					mbrApp.$body.on("change", "#witsec-anchor-editor-sections", function(a) {
						var ind = this.selectedIndex;
						var currentPage = mbrApp.Core.currentPage;
						curr = mbrApp.Core.resultJSON[currentPage].components[ind];
						$("#witsec-anchor-editor-name").val(curr._anchor);
					});

					mbrApp.showDialog({
						title: "Anchor Editor",
						className: "",
						body: [
							'<div>Make sure you only use valid characters in your anchor name.</div>',
							'<div>&nbsp;</div>',
							'<div class="row">',
							'  <div class="col-lg-5"><select class"form-control" id="witsec-anchor-editor-sections">', complist, '</select></div>',
							'  <div class="col-lg-7">Anchor: <input type="text" class"form-control" id="witsec-anchor-editor-name" value="', curr._anchor, '"></div>',
							'</div>'
						].join("\n"),
						buttons: [{
							label: "SAVE",
							default: !0,
							callback: function() {
								try {
									var anchor = $('#witsec-anchor-editor-name').val();

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
									mbrApp.alertDlg(err.name + ' with message : ' +err.message);
								}
							}
						},
							{
							label: "CLOSE",
							default: !0,
							callback: function() {									
							}
						}
						]
					});
				});				
            }
        }
    })
})(jQuery, mbrApp);