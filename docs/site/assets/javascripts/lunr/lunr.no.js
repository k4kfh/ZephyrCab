!function(e,r){"function"==typeof define&&define.amd?define(r):"object"==typeof exports?module.exports=r():r()(e.lunr)}(this,function(){return function(e){if(void 0===e)throw new Error("Lunr is not present. Please include / require Lunr before this script.");if(void 0===e.stemmerSupport)throw new Error("Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.");e.no=function(){this.pipeline.reset(),this.pipeline.add(e.no.trimmer,e.no.stopWordFilter,e.no.stemmer),this.searchPipeline&&(this.searchPipeline.reset(),this.searchPipeline.add(e.no.stemmer))},e.no.wordCharacters="A-Za-zªºÀ-ÖØ-öø-ʸˠ-ˤᴀ-ᴥᴬ-ᵜᵢ-ᵥᵫ-ᵷᵹ-ᶾḀ-ỿⁱⁿₐ-ₜKÅℲⅎⅠ-ↈⱠ-ⱿꜢ-ꞇꞋ-ꞭꞰ-ꞷꟷ-ꟿꬰ-ꭚꭜ-ꭤﬀ-ﬆＡ-Ｚａ-ｚ",e.no.trimmer=e.trimmerSupport.generateTrimmer(e.no.wordCharacters),e.Pipeline.registerFunction(e.no.trimmer,"trimmer-no"),e.no.stemmer=function(){var r=e.stemmerSupport.Among,n=e.stemmerSupport.SnowballProgram,i=new function(){function e(){var e,r=w.cursor+3;if(a=w.limit,0<=r||r<=w.limit){for(s=r;;){if(e=w.cursor,w.in_grouping(d,97,248)){w.cursor=e;break}if(e>=w.limit)return;w.cursor=e+1}for(;!w.out_grouping(d,97,248);){if(w.cursor>=w.limit)return;w.cursor++}(a=w.cursor)<s&&(a=s)}}function i(){var e,r,n;if(w.cursor>=a&&(r=w.limit_backward,w.limit_backward=a,w.ket=w.cursor,e=w.find_among_b(m,29),w.limit_backward=r,e))switch(w.bra=w.cursor,e){case 1:w.slice_del();break;case 2:n=w.limit-w.cursor,w.in_grouping_b(c,98,122)?w.slice_del():(w.cursor=w.limit-n,w.eq_s_b(1,"k")&&w.out_grouping_b(d,97,248)&&w.slice_del());break;case 3:w.slice_from("er")}}function t(){var e,r=w.limit-w.cursor;w.cursor>=a&&(e=w.limit_backward,w.limit_backward=a,w.ket=w.cursor,w.find_among_b(u,2)?(w.bra=w.cursor,w.limit_backward=e,w.cursor=w.limit-r,w.cursor>w.limit_backward&&(w.cursor--,w.bra=w.cursor,w.slice_del())):w.limit_backward=e)}function o(){var e,r;w.cursor>=a&&(r=w.limit_backward,w.limit_backward=a,w.ket=w.cursor,(e=w.find_among_b(l,11))?(w.bra=w.cursor,w.limit_backward=r,1==e&&w.slice_del()):w.limit_backward=r)}var s,a,m=[new r("a",-1,1),new r("e",-1,1),new r("ede",1,1),new r("ande",1,1),new r("ende",1,1),new r("ane",1,1),new r("ene",1,1),new r("hetene",6,1),new r("erte",1,3),new r("en",-1,1),new r("heten",9,1),new r("ar",-1,1),new r("er",-1,1),new r("heter",12,1),new r("s",-1,2),new r("as",14,1),new r("es",14,1),new r("edes",16,1),new r("endes",16,1),new r("enes",16,1),new r("hetenes",19,1),new r("ens",14,1),new r("hetens",21,1),new r("ers",14,1),new r("ets",14,1),new r("et",-1,1),new r("het",25,1),new r("ert",-1,3),new r("ast",-1,1)],u=[new r("dt",-1,-1),new r("vt",-1,-1)],l=[new r("leg",-1,1),new r("eleg",0,1),new r("ig",-1,1),new r("eig",2,1),new r("lig",2,1),new r("elig",4,1),new r("els",-1,1),new r("lov",-1,1),new r("elov",7,1),new r("slov",7,1),new r("hetslov",9,1)],d=[17,65,16,1,0,0,0,0,0,0,0,0,0,0,0,0,48,0,128],c=[119,125,149,1],w=new n;this.setCurrent=function(e){w.setCurrent(e)},this.getCurrent=function(){return w.getCurrent()},this.stem=function(){var r=w.cursor;return e(),w.limit_backward=r,w.cursor=w.limit,i(),w.cursor=w.limit,t(),w.cursor=w.limit,o(),!0}};return function(e){return"function"==typeof e.update?e.update(function(e){return i.setCurrent(e),i.stem(),i.getCurrent()}):(i.setCurrent(e),i.stem(),i.getCurrent())}}(),e.Pipeline.registerFunction(e.no.stemmer,"stemmer-no"),e.no.stopWordFilter=e.generateStopWordFilter("alle at av bare begge ble blei bli blir blitt både båe da de deg dei deim deira deires dem den denne der dere deres det dette di din disse ditt du dykk dykkar då eg ein eit eitt eller elles en enn er et ett etter for fordi fra før ha hadde han hans har hennar henne hennes her hjå ho hoe honom hoss hossen hun hva hvem hver hvilke hvilken hvis hvor hvordan hvorfor i ikke ikkje ikkje ingen ingi inkje inn inni ja jeg kan kom korleis korso kun kunne kva kvar kvarhelst kven kvi kvifor man mange me med medan meg meget mellom men mi min mine mitt mot mykje ned no noe noen noka noko nokon nokor nokre nå når og også om opp oss over på samme seg selv si si sia sidan siden sin sine sitt sjøl skal skulle slik so som som somme somt så sånn til um upp ut uten var vart varte ved vere verte vi vil ville vore vors vort vår være være vært å".split(" ")),e.Pipeline.registerFunction(e.no.stopWordFilter,"stopWordFilter-no")}});