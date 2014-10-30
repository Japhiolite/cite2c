requirejs.config({
    shim: {
        'nbextensions/cite2c/xmldom': {
            deps: [],
            exports: "CSL_CHROME"
        },
        'nbextensions/cite2c/citeproc': {
            deps: ['nbextensions/cite2c/xmldom'],
            exports: "CSL"
        }
    }
});

define(['jquery',
        'base/js/dialog',
        'nbextensions/cite2c/citeproc',
        'nbextensions/cite2c/typeahead.jquery'],
function($, dialog, CSL) {
    "use strict";
    
    /*
     * Part 1: Find and render citations using citeproc-js
     */
    
    var cpSys = {
        retrieveLocale: function(lang) {
            // Any locale you want, so long as it's en-US
            return "<locale xml:lang=\"en\" xmlns=\"http://purl.org/net/xbiblio/csl\">  <style-options punctuation-in-quote=\"true\"/>  <date form=\"text\">    <date-part name=\"month\" suffix=\" \"/>    <date-part name=\"day\" suffix=\", \"/>    <date-part name=\"year\"/>  </date>  <date form=\"numeric\">    <date-part name=\"year\"/>    <date-part name=\"month\" form=\"numeric\" prefix=\"-\" range-delimiter=\"/\"/>    <date-part name=\"day\" prefix=\"-\" range-delimiter=\"/\"/>  </date>  <terms>    <term name=\"document-number-label\">No.</term>    <term name=\"document-number-authority-suffix\">Doc.</term>    <term name=\"un-sales-number-label\">U.N. Sales No.</term>    <term name=\"collection-number-label\">No.</term>    <term name=\"open-quote\">\u201c</term>    <term name=\"close-quote\">\u201d</term>    <term name=\"open-inner-quote\">\u2018</term>    <term name=\"close-inner-quote\">\u2019</term>    <term name=\"ordinal-01\">st</term>    <term name=\"ordinal-02\">nd</term>    <term name=\"ordinal-03\">rd</term>    <term name=\"ordinal-04\">th</term>    <term name=\"long-ordinal-01\">first</term>    <term name=\"long-ordinal-02\">second</term>    <term name=\"long-ordinal-03\">third</term>    <term name=\"long-ordinal-04\">fourth</term>    <term name=\"long-ordinal-05\">fifth</term>    <term name=\"long-ordinal-06\">sixth</term>    <term name=\"long-ordinal-07\">seventh</term>    <term name=\"long-ordinal-08\">eighth</term>    <term name=\"long-ordinal-09\">ninth</term>    <term name=\"long-ordinal-10\">tenth</term>    <term name=\"at\">at</term>    <term name=\"in\">in</term>    <term name=\"ibid\">ibid</term>    <term name=\"accessed\">accessed</term>    <term name=\"retrieved\">retrieved</term>    <term name=\"from\">from</term>    <term name=\"forthcoming\">forthcoming</term>    <term name=\"references\">      <single>reference</single>      <multiple>references</multiple>    </term>    <term name=\"references\" form=\"short\">      <single>ref</single>      <multiple>refs</multiple>    </term>    <term name=\"no date\">n.d.</term>    <term name=\"and\">and</term>    <term name=\"et-al\">et al.</term>    <term name=\"interview\">interview</term>    <term name=\"letter\">letter</term>    <term name=\"anonymous\">anonymous</term>    <term name=\"anonymous\" form=\"short\">anon.</term>    <term name=\"and others\">and others</term>    <term name=\"in press\">in press</term>    <term name=\"online\">online</term>    <term name=\"cited\">cited</term>    <term name=\"internet\">internet</term>    <term name=\"presented at\">presented at the</term>    <term name=\"ad\">AD</term>    <term name=\"bc\">BC</term>    <term name=\"season-01\">Spring</term>    <term name=\"season-02\">Summer</term>    <term name=\"season-03\">Autumn</term>    <term name=\"season-04\">Winter</term>    <term name=\"with\">with</term>        <!-- CATEGORIES -->    <term name=\"anthropology\">anthropology</term>    <term name=\"astronomy\">astronomy</term>    <term name=\"biology\">biology</term>    <term name=\"botany\">botany</term>    <term name=\"chemistry\">chemistry</term>    <term name=\"engineering\">engineering</term>    <term name=\"generic-base\">generic base</term>    <term name=\"geography\">geography</term>    <term name=\"geology\">geology</term>    <term name=\"history\">history</term>    <term name=\"humanities\">humanities</term>    <term name=\"literature\">literature</term>    <term name=\"math\">math</term>    <term name=\"medicine\">medicine</term>    <term name=\"philosophy\">philosophy</term>    <term name=\"physics\">physics</term>    <term name=\"psychology\">psychology</term>    <term name=\"sociology\">sociology</term>    <term name=\"science\">science</term>    <term name=\"political_science\">political science</term>    <term name=\"social_science\">social science</term>    <term name=\"theology\">theology</term>    <term name=\"zoology\">zoology</term>        <!-- LONG LOCATOR FORMS -->    <term name=\"book\">      <single>book</single>      <multiple>books</multiple>    </term>    <term name=\"chapter\">      <single>chapter</single>      <multiple>chapters</multiple>    </term>    <term name=\"column\">      <single>column</single>      <multiple>columns</multiple>    </term>    <term name=\"figure\">      <single>figure</single>      <multiple>figures</multiple>    </term>    <term name=\"folio\">      <single>folio</single>      <multiple>folios</multiple>    </term>    <term name=\"issue\">      <single>number</single>      <multiple>numbers</multiple>    </term>    <term name=\"line\">      <single>line</single>      <multiple>lines</multiple>    </term>    <term name=\"note\">      <single>note</single>      <multiple>notes</multiple>    </term>    <term name=\"opus\">      <single>opus</single>      <multiple>opera</multiple>    </term>    <term name=\"page\">      <single>page</single>      <multiple>pages</multiple>    </term>    <term name=\"paragraph\">      <single>paragraph</single>      <multiple>paragraph</multiple>    </term>    <term name=\"part\">      <single>part</single>      <multiple>parts</multiple>    </term>    <term name=\"section\">      <single>section</single>      <multiple>sections</multiple>    </term>    <term name=\"volume\">      <single>volume</single>      <multiple>volumes</multiple>    </term>    <term name=\"edition\">      <single>edition</single>      <multiple>editions</multiple>    </term>    <term name=\"verse\">      <single>verse</single>      <multiple>verses</multiple>    </term>    <term name=\"sub verbo\">      <single>sub verbo</single>      <multiple>s.vv</multiple>    </term>        <!-- SHORT LOCATOR FORMS -->    <term name=\"book\" form=\"short\">bk.</term>    <term name=\"chapter\" form=\"short\">chap.</term>    <term name=\"column\" form=\"short\">col.</term>    <term name=\"figure\" form=\"short\">fig.</term>    <term name=\"folio\" form=\"short\">f.</term>    <term name=\"issue\" form=\"short\">no.</term>    <term name=\"opus\" form=\"short\">op.</term>    <term name=\"page\" form=\"short\">      <single>p.</single>      <multiple>pp.</multiple>    </term>    <term name=\"paragraph\" form=\"short\">para.</term>    <term name=\"part\" form=\"short\">pt.</term>    <term name=\"section\" form=\"short\">sec.</term>    <term name=\"sub verbo\" form=\"short\">      <single>s.v.</single>      <multiple>s.vv.</multiple>    </term>    <term name=\"verse\" form=\"short\">      <single>v.</single>      <multiple>vv.</multiple>    </term>    <term name=\"volume\" form=\"short\">    	<single>vol.</single>    	<multiple>vols.</multiple>    </term>    <term name=\"edition\">edition</term>    <term name=\"edition\" form=\"short\">ed.</term>        <!-- SYMBOL LOCATOR FORMS -->    <term name=\"paragraph\" form=\"symbol\">      <single>Â¶</single>      <multiple>Â¶Â¶</multiple>    </term>    <term name=\"section\" form=\"symbol\">      <single>Â§</single>      <multiple>Â§Â§</multiple>    </term>        <!-- LONG ROLE FORMS -->    <term name=\"author\">      <single></single>      <multiple></multiple>    </term>    <term name=\"editor\">      <single>editor</single>      <multiple>editors</multiple>    </term>    <term name=\"translator\">      <single>translator</single>      <multiple>translators</multiple>    </term>        <!-- SHORT ROLE FORMS -->    <term name=\"author\" form=\"short\">      <single></single>      <multiple></multiple>    </term>    <term name=\"editor\" form=\"short\">      <single>ed.</single>      <multiple>eds.</multiple>    </term>    <term name=\"translator\" form=\"short\">      <single>tran.</single>      <multiple>trans.</multiple>    </term>        <!-- VERB ROLE FORMS -->    <term name=\"editor\" form=\"verb\">edited by</term>    <term name=\"translator\" form=\"verb\">translated by</term>    <term name=\"recipient\" form=\"verb\">to</term>    <term name=\"interviewer\" form=\"verb\">interview by</term>        <!-- SHORT VERB ROLE FORMS -->    <term name=\"editor\" form=\"verb-short\">ed.</term>    <term name=\"translator\" form=\"verb-short\">trans.</term>        <!-- LONG MONTH FORMS -->    <term name=\"month-01\">January</term>    <term name=\"month-02\">February</term>    <term name=\"month-03\">March</term>    <term name=\"month-04\">April</term>    <term name=\"month-05\">May</term>    <term name=\"month-06\">June</term>    <term name=\"month-07\">July</term>    <term name=\"month-08\">August</term>    <term name=\"month-09\">September</term>    <term name=\"month-10\">October</term>    <term name=\"month-11\">November</term>    <term name=\"month-12\">December</term>        <!-- SHORT MONTH FORMS -->    <term name=\"month-01\" form=\"short\">Jan.</term>    <term name=\"month-02\" form=\"short\">Feb.</term>    <term name=\"month-03\" form=\"short\">Mar.</term>    <term name=\"month-04\" form=\"short\">Apr.</term>	<term name=\"month-05\" form=\"short\">May</term>    <term name=\"month-06\" form=\"short\">Jun.</term>    <term name=\"month-07\" form=\"short\">Jul.</term>    <term name=\"month-08\" form=\"short\">Aug.</term>    <term name=\"month-09\" form=\"short\">Sep.</term>    <term name=\"month-10\" form=\"short\">Oct.</term>    <term name=\"month-11\" form=\"short\">Nov.</term>    <term name=\"month-12\" form=\"short\">Dec.</term>  </terms></locale>";
        },
        retrieveItem: function(id) {
            var item = IPython.notebook.metadata.cite2c.citations[id];
            item.id = id;  // Not documented, but citeproc breaks without this
            return item;
        }
    };
    
    var make_citeproc_pairs = function(citns) {
        return citns.map(function(citn) {
            return [citn.id, 0];
        });
    };
     
    $.ajax("/nbextensions/cite2c/chicago-author-date.csl", {
        dataType: "text",
        success: function(styleAsText, textStatus, jqXHR) {
            var citeproc = new CSL.Engine(cpSys, styleAsText);
            
            //ids = ["batpol", "allium_vavilovii"];
            //citeproc.updateItems(ids);
       
            function render_biblio() {
                var biblio_targets = $('.cite2c-biblio');
                if (biblio_targets.length === 0) {
                    return;
                }
                var bibdata = citeproc.makeBibliography();
                var bibmetadata = bibdata[0];
                var bibhtml = bibmetadata.bibstart + bibdata[1].join('') + bibmetadata.bibend;
                biblio_targets.html(bibhtml);
            }

            function process_cell_citations(cell) {
                var i=0;
                
                var all_cells = IPython.notebook.get_cells();
                var after_current = false;
                var citns_before = [];
                var citns_after = [];
                for (i=0; i < all_cells.length; i++) {
                    if (all_cells[i] === cell) {
                        after_current = true;
                        continue;
                    }
                    if (after_current) {
                        citns_after = citns_after.concat(all_cells[i]._cite2c_citns || []);
                    } else {
                        citns_before = citns_before.concat(all_cells[i]._cite2c_citns || []);
                    }
                }
                
                var element = cell.element.find('div.text_cell_render');
                var citn_elements = element.find("[data-cite]");
                cell._cite2c_citns = [];
                var newbiblios = element.find(".cite2c-biblio");
                
                var bibchange = (newbiblios.length > 0);
                for (i=0; i < citn_elements.length; i++) {
                    var citn_element = citn_elements[i];
                    var id = citn_element.dataset.cite;

                    var citeproc_citn = {citationItems: [{id: id}],
                                            properties: {noteIndex: 0}
                                        };
                    var results = citeproc.processCitationCluster(citeproc_citn, 
                                            make_citeproc_pairs(citns_before),
                                            make_citeproc_pairs(citns_after));
                    var citn = {id: citeproc_citn.citationID, element: citn_element};
                    cell._cite2c_citns.push(citn);
                    
                    bibchange = bibchange || results[0].bibchange;
                    var updates = results[1];
                    var all_citns = citns_before.concat([citn], citns_after);
                    
                    for (var j=0; j <  updates.length; j++) {
                        var idx = updates[j][0];
                        var newcontent = updates[j][1];
                        all_citns[idx].element.innerHTML = newcontent;
                    }
                    citns_before.push(citn);
                }
                
                // This is false when I would expect it to be true. For now,
                // just re-render the bibliography every time.
                //if (bibchange) {
                    render_biblio();
                //}
            } // end process_cell_citations
            
            IPython.notebook.events.on("rendered.MarkdownCell", function(event, data) {
                process_cell_citations(data.cell);
            });
            
            function reprocess_all() {
                var all_cells = IPython.notebook.get_cells();
                var i = 0;
                for (i = 0; i < all_cells.length; i++) {
                    delete all_cells[i]._cite2c_citns;
                }
                for (i = 0; i < all_cells.length; i++) {
                    var cell = all_cells[i];
                    if (cell.cell_type === "markdown") {
                        process_cell_citations(cell);
                    }
                }
            }
            
            // Process all citations on load
            reprocess_all();
        }
    });
    
    /*
     * Part 2: Insert citations in the notebook interface, searching Zotero
     * for data.
     */
    
    var make_author_string = function(authors) {
        // Make a simple string of the author surnames, to show in the
        // typeahead dropdown
        var surname = function(auth) { return auth.family || "?"; };
        if (!authors)  return "";
        switch (authors.length) {
            case 0:
                return "";
            case 1:
                return surname(authors[0]);
            case 2:
                return surname(authors[0]) + " & " + surname(authors[1]);
            default:
                return surname(authors[0]) + " et al.";
        }
    };
    
    var store_citation = function(id, citation) {
        // Store citation data to notebook metadata
        var metadata = IPython.notebook.metadata;
        if (!metadata.cite2c) metadata.cite2c = {};
        if (!metadata.cite2c.citations) metadata.cite2c.citations = {};
        metadata.cite2c.citations[id] = citation;
    };
    
    function insert_citn() {
        // Insert citation from dialog
        var cell = IPython.notebook.get_selected_cell();
        
        var entry_box = $('<input type="text"/>');
        var spinner = $('<span class="fa fa-spinner fa-spin"/>');
        spinner.hide();
        var dialog_body = $("<div/>")
                    .append($("<p/>").text("Start typing below to search Zotero"))
                    .append(entry_box)
                    .append(spinner);
        dialog_body.addClass("cite2c-dialog");
        
        var zotero_search = function(query, cb) {
            // Search Zotero, call cb with an array of CSL JSON citations
            spinner.show();
            $.ajax("https://api.zotero.org/users/11141/items?v=3&limit=10&format=csljson&q=" + query, 
                {
                    accepts: "application/vnd.citationstyles.csl+json",
                    dataType: "json",
                    success: function(data) {
                        spinner.hide();
                        cb(data.items);
                    }
                });
        };

        // Set up typeahead.js to search Zotero
        entry_box.typeahead({
          minLength: 3,
          highlight: true,
        },
        {
          name: 'zotero',
          source: zotero_search,
          displayKey: function(value) { return value.title || "Mystery item with no title"; },
          templates: {
              empty: "No matches",
              suggestion: function(value) {
                  //console.log(value);
                  return "<div>"+value.title+"</div>" +
                    '<div style="float: right; color: #888;">' + (value.type || "?") + "</div>" +
                    "<div><i>"+ make_author_string(value.author) + "</i></div>";
              }
          }
        });
        
        entry_box.on('typeahead:selected', function(ev, suggestion, dataset) {
            entry_box.data("csljson", suggestion);
        });
        
        // Display dialog
        dialog.modal({
            notebook: IPython.notebook,
            keyboard_manager: IPython.keyboard_manager,
            title : "Insert citation",
            body : dialog_body,
            open: function() {entry_box.focus();},
            buttons : {
                "Cancel" : {},
                "Insert" : {
                    "class" : "btn-primary",
                    "click" : function() {
                        var citation = entry_box.data("csljson");
                        var id = citation.id;
                        delete citation.id;
                        store_citation(id, citation);
                        var citn_html = '<cite data-cite="' + id + '"></cite>';
                        cell.code_mirror.replaceSelection(citn_html);
                    }
                }
            }
        });
    }
    
    var insert_biblio = function() {
        // Insert HTML tag for bibliography
        var cell = IPython.notebook.get_selected_cell();
        cell.code_mirror.replaceSelection('<div class="cite2c-biblio"></div>');
    };
    
    var citn_button = function () {
        // Add toolbar buttons to insert citations and bibliographies
        if (!IPython.toolbar) {
            $([IPython.events]).on("app_initialized.NotebookApp", citn_button);
            return;
        }
        if ($("#toc_button").length === 0) {
            IPython.toolbar.add_buttons_group([
                {
                  'label' : 'Insert citation',
                  'icon' : 'fa-mortar-board',
                  'callback': insert_citn,
                  'id' : 'insert_citn_button'
                },
                {
                  label: 'Insert bibliography',
                  icon: 'fa-list',
                  callback: insert_biblio,
                  id: 'insert_biblio_button'
                }
            ]);
        }
    };

    function load_ipython_extension() {
        citn_button();
        $('head').append('<link rel="stylesheet" href="/nbextensions/cite2c/styles.css" type="text/css" />');
    }

    return {load_ipython_extension: load_ipython_extension};
});
