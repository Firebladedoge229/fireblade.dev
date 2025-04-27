var LOCALSTORAGE_SCORE = "score";

function CLocalStorage(szName){
    
    this._init = function(szName){
        //window.localStorage.clear();
        var bFlag = window.localStorage.getItem(szName);

        if(bFlag === null || bFlag === undefined){   
            this.resetAllData();   
        }
        
    };
    
    this.setItem = function(szKey, szValue){
        _bDirty = true;
        window.localStorage.setItem(szName+"_"+szKey, szValue);
    };
    
    this.getItem = function(szKey){
        return window.localStorage.getItem(szName+"_"+szKey);
    };
    
    this.setItemJson = function(szKey, jsonObj){
        localStorage.setItem(szName+"_"+szKey, JSON.stringify(jsonObj));
    };
    
    this.getItemJson = function(szKey){
        return JSON.parse(localStorage.getItem(szName+"_"+szKey));
    };
    
    this.isDirty = function(){
        var aLevelScore = s_oLocalStorage.getItemJson(LOCALSTORAGE_SCORE);
        for (var i = 0; i <aLevelScore.length; i++) {
            if(aLevelScore[i] > 0){
                return true;
            }
        }
        return false;
    };

    this.resetAllData = function(){        
        window.localStorage.setItem(szName, true);
            
        var aScore = new Array();
        for(var i=0; i<NUM_HOLES; i++){
            aScore[i] = 0;
        }
        this.setItemJson(LOCALSTORAGE_SCORE,aScore);
    };

    this._init(szName);
    
}