/*******************************************************************************
Programador:        Hans Von Herrera Ortega
Objeto:            	MooTools.SelectSwap
Descripción:        Objeto para generar listas.
Historial:          ==========================================================
					Programador-Alias			Acción				Fecha
					==========================================================
					HansPHP						Creación            23/03/2014
Descripción:        Se creó el objeto.
					==========================================================
Versión:            1.0    
*******************************************************************************/

MooTools.SelectSwap = new Class({

	Implements: [Options, Events],

	options: {
		script:'services.json',
		place:'id',
		onRequest: function(){
			//console.log("Tabla Generada -->>>");
		},
		onError: function(){
			//console.log("Ordenando tabla");	
		},
		onSuccess: function(json){
			//console.log("Borrando:"+this.getId(btn));
		},
		onRight: function(ele){
			//var self = this;
			//console.log('RIGHT');
			//console.log(ele);
		},
		onLeft: function(ele){
			//var self = this;
			//console.log('LEFT');
			//console.log(ele);
		}
	},
	updateSize: function(){
		this.lstSelected.size = this.lstSelected.getChildren('option').length;
		this.lstPool.size = this.lstPool.getChildren('option').length;
	},
	lstPool:null,
	lstSelected:null,
	initialize: function(place, options){
		var place = this.options.place = document.id(place);
		this.setOptions(options);
		/* HTML Content */
		place.grab(new Element('div.header',{'html':"<div>"+this.options.lstPool+"</div><div></div><div>"+this.options.lstSelected+"</div>"}));
	},
	fill: function(SelectSwap){
		var self = this;
		var place = self.options.place;
		
		var lstPool = new Element('div.top');
		var optMiddle = (new Element('div.middle')).grab(
						new Element('div#ss_right').addEvent('click', function(){
								var arr = new Array();
								self.lstPool.getChildren('option').each(function(item, index){
								if(item.selected){
									self.lstSelected.grab(item);
									arr.push(item.value);
									item.selected = false; 
								}
								});
								self.updateSize();
								self.fireEvent('onRight', arr.join(','));
							})
		).grab(new Element('div#ss_left').addEvent('click', function(){
								var arr = new Array();
								self.lstSelected.getChildren('option').each(function(item, index){
								if(item.selected){
									self.lstPool.grab(item);
									arr.push(item.value);
									item.selected = false;
								}
								});
								self.updateSize();
								self.fireEvent('onLeft', arr.join(','));
							}));
		var lstSelected = new Element('div.top');
		place.grab((new Element('div')).grab(lstPool).grab(optMiddle).grab(lstSelected));

		this.lstPool = (new Element('select[multiple]',{'name':'lstPool', 'size':SelectSwap.pool.length})).inject(lstPool);
		this.lstSelected = (new Element('select[multiple]',{'name':'lstSelected', 'size':SelectSwap.selected.length})).inject(lstSelected);

		SelectSwap.pool.each(function(item, index){
			self.lstPool.grab(new Element('option',{'value':item.id,'html':item.name}));
		});
		SelectSwap.selected.each(function(item, index){
			self.lstSelected.grab(new Element('option',{'value':item.id,'html':item.name}));
		});
	},
	get: function(){
		var self = this;
		var place = self.options.place;
		var jsonRequest = new Request.JSON({
			url: self.options.script,
			onRequest: function(){
				self.fireEvent('onRequest');
			},
			onError: function(text, error){
				self.fireEvent('onError');
			},
			onSuccess: function(json){
				self.fill(json.SelectSwap);
			}
		}).send();
	}
	
});