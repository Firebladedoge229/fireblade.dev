function CMain(oData) {
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    
    var _aLevelLoaded;

    var _oPreloader;
    var _oMenu;
    var _oHelp;
    var _oLevelMenu;
    var _oGame;
    var _oLoadingScreen;

    this.initContainer = function () {
        var canvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(canvas);
        createjs.Touch.enable(s_oStage);
        s_oStage.preventSelection = false;

        s_bMobile = jQuery.browser.mobile;
        if (s_bMobile === false) {
            s_oStage.enableMouseOver(20);
            $('body').on('contextmenu', '#canvas', function (e) {
                return false;
            });
        }

        s_iPrevTime = new Date().getTime();

        createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.setFPS(FPS);

        if (navigator.userAgent.match(/Windows Phone/i)) {
            DISABLE_SOUND_MOBILE = true;
        }

        _aLevelLoaded = new Array();

        s_oSpriteLibrary = new CSpriteLibrary();

        s_oTweenController = new CTweenController();

        //ADD PRELOADER
        _oPreloader = new CPreloader();

        s_oLocalStorage = new CLocalStorage("minigolf_world");

        _bUpdate = true;
    };

    this.soundLoaded = function () {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);

        if (_iCurResource === RESOURCE_TO_LOAD) {
            _oPreloader.unload();

            if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
                s_oSoundTrack = createjs.Sound.play("soundtrack", {loop: -1});
            }
            this.gotoMenu();
        }
    };

    this._initSounds = function () {
        if (!createjs.Sound.initializeDefaultPlugins()) {
            return;
        }

        if (navigator.userAgent.indexOf("Opera") > 0 || navigator.userAgent.indexOf("OPR") > 0) {
            createjs.Sound.alternateExtensions = ["mp3"];
            createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this));

            createjs.Sound.registerSound("./sounds/click.ogg", "click");
            createjs.Sound.registerSound("./sounds/soundtrack.ogg", "soundtrack");
            createjs.Sound.registerSound("./sounds/win_level.ogg", "win_level");
            createjs.Sound.registerSound("./sounds/ambience.ogg", "ambience");
            createjs.Sound.registerSound("./sounds/hit_ball.ogg", "hit_ball");
            createjs.Sound.registerSound("./sounds/hole.ogg", "hole");
            createjs.Sound.registerSound("./sounds/sand.ogg", "sand");
            createjs.Sound.registerSound("./sounds/water.ogg", "water");
            createjs.Sound.registerSound("./sounds/star.ogg", "star");
            
        } else {
            createjs.Sound.alternateExtensions = ["ogg"];
            createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this));

            createjs.Sound.registerSound("./sounds/click.mp3", "click");
            createjs.Sound.registerSound("./sounds/soundtrack.mp3", "soundtrack");
            createjs.Sound.registerSound("./sounds/win_level.mp3", "win_level");
            createjs.Sound.registerSound("./sounds/ambience.mp3", "ambience");
            createjs.Sound.registerSound("./sounds/hit_ball.mp3", "hit_ball");
            createjs.Sound.registerSound("./sounds/hole.mp3", "hole");
            createjs.Sound.registerSound("./sounds/sand.mp3", "sand");
            createjs.Sound.registerSound("./sounds/water.mp3", "water");
            createjs.Sound.registerSound("./sounds/star.mp3", "star");
        }

        RESOURCE_TO_LOAD += 9;

    };

    this._loadImages = function () {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);

        s_oSpriteLibrary.addSprite("preloader_anim", "./sprites/preloader_anim.png");
        s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_continue", "./sprites/but_continue.png");
        s_oSpriteLibrary.addSprite("but_continue_big", "./sprites/but_continue_big.png");
        s_oSpriteLibrary.addSprite("but_info", "./sprites/but_info.png");
        s_oSpriteLibrary.addSprite("ctl_logo", "./sprites/ctl_logo.png");
        s_oSpriteLibrary.addSprite("but_yes", "./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_not", "./sprites/but_not.png");
        s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("but_restart_small", "./sprites/but_restart_small.png");
        s_oSpriteLibrary.addSprite("but_restart_big", "./sprites/but_restart_big.png");
        s_oSpriteLibrary.addSprite("help_touch", "./sprites/help_touch.png");
        s_oSpriteLibrary.addSprite("star", "./sprites/star.png");
        s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_home", "./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("ball", "./sprites/ball.png");
        s_oSpriteLibrary.addSprite("arrow", "./sprites/arrow.png");
        s_oSpriteLibrary.addSprite("but_level", "./sprites/but_level.png");
        s_oSpriteLibrary.addSprite("flag", "./sprites/flag.png");
        s_oSpriteLibrary.addSprite("ball_shadow", "./sprites/ball_shadow.png");
        s_oSpriteLibrary.addSprite("caustics", "./sprites/caustics.png");
        s_oSpriteLibrary.addSprite("but_center_view", "./sprites/but_center_view.png");
        s_oSpriteLibrary.addSprite("ball_water", "./sprites/ball_water.png");
        s_oSpriteLibrary.addSprite("press_indicator", "./sprites/press_indicator.png");
        s_oSpriteLibrary.addSprite("menu_text_minigolf", "./sprites/menu_text_minigolf.png");
        s_oSpriteLibrary.addSprite("menu_text_world", "./sprites/menu_text_world.png");


        s_oSpriteLibrary.addSprite("arrow", "./sprites/arrow.png");
        s_oSpriteLibrary.addSprite("arrow_fill", "./sprites/arrow_fill.png");
        s_oSpriteLibrary.addSprite("arrow_frame", "./sprites/arrow_frame.png");


        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function () {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);
        if (_iCurResource === RESOURCE_TO_LOAD) {
            _oPreloader.unload();
            if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
                s_oSoundTrack = createjs.Sound.play("soundtrack", {loop: -1});
            }
            this.gotoMenu();
        }
    };

    this._onAllImagesLoaded = function () {

    };

    this.onAllPreloaderImagesLoaded = function () {
        this._loadImages();
    };
    

    this.loadSelectedLevel = function(iLevel){

        s_iCurLevel = iLevel;
        _iCurResource = 0;
        RESOURCE_TO_LOAD = 0;

        if (_aLevelLoaded[iLevel]) {
            this.gotoGame(s_iCurLevel);
            return;
        }

        _oLoadingScreen = new CLoadingScreen(s_oStage);

        s_oSpriteLibrary.init(this._onLevelLoaded, this._onAllImagesLoaded, this);
       
        var szSpriteLevel = iLevel +1;
        var szTag;
        for(var i=1; i<=18; i++){
             szTag = i-1;
             if(i<10){
                 var szPadding = "0"+i+"";
                 s_oSpriteLibrary.addSprite("level_"+szSpriteLevel+"_bg_"+szTag, "./sprites/bg_levels/level_"+szSpriteLevel+"/bg_piece_"+szPadding+".jpg");
             }else{
                 s_oSpriteLibrary.addSprite("level_"+szSpriteLevel+"_bg_"+szTag, "./sprites/bg_levels/level_"+szSpriteLevel+"/bg_piece_"+i+".jpg");
             }
        }

        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();

        s_oSpriteLibrary.loadSprites();
       
    };
    
    this._onLevelLoaded = function(){
        _iCurResource++;
        if (_iCurResource === RESOURCE_TO_LOAD) {
            _aLevelLoaded[s_iCurLevel] = true;
            _oLoadingScreen.unload();
            this.gotoGame(s_iCurLevel);
            
            var iNextLevelToLoad = s_iCurLevel+1;
            this.loadInBackgroundLevel(iNextLevelToLoad);
        }
    };
    
    this.loadInBackgroundLevel = function(iLevel){
        s_iBackgroundLevel = iLevel;
        _iCurResource = 0;
        RESOURCE_TO_LOAD = 0;

        if (_aLevelLoaded[iLevel]) {
            return;
        }

        s_oSpriteLibrary.init(this._onBackgroundLevelLoaded, this._onAllImagesLoaded, this);
       
        var szSpriteLevel = iLevel +1;
        var szTag;
        for(var i=1; i<=18; i++){
             szTag = i-1;
             if(i<10){
                 var szPadding = "0"+i+"";
                 s_oSpriteLibrary.addSprite("level_"+szSpriteLevel+"_bg_"+szTag, "./sprites/bg_levels/level_"+szSpriteLevel+"/bg_piece_"+szPadding+".jpg");
             }else{
                 s_oSpriteLibrary.addSprite("level_"+szSpriteLevel+"_bg_"+szTag, "./sprites/bg_levels/level_"+szSpriteLevel+"/bg_piece_"+i+".jpg");
             }
        }

        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();

        s_oSpriteLibrary.loadSprites();
    };
    
    this._onBackgroundLevelLoaded = function(){
        _iCurResource++;
        if (_iCurResource === RESOURCE_TO_LOAD) {
            _aLevelLoaded[s_iBackgroundLevel] = true;

            var bAllLevelsLoaded = true;
            for(var i=0; i<NUM_HOLES; i++){
                if(!_aLevelLoaded[i]){
                    bAllLevelsLoaded = false;
                }
            }
            
            if(bAllLevelsLoaded){
                return;
            }

            var iNextLevelToLoad = s_iBackgroundLevel+1;
            if(iNextLevelToLoad < NUM_HOLES){
                this.loadInBackgroundLevel(iNextLevelToLoad);
            } else {
                this.loadInBackgroundLevel(1);
            }
        }
    };

    this.preloaderReady = function () {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            this._initSounds();
            s_oSoundTrack = createjs.Sound.play("soundtrack", {loop: -1});
        }

        this._loadImages();
        _bUpdate = true;
    };

    this.gotoMenu = function () {
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };

    this.gotoGame = function (iLevel) {
        _oGame = new CGame(_oData, iLevel);

        _iState = STATE_GAME;
    };

    this.gotoLevelMenu = function () {
        _oLevelMenu = new CLevelMenu();
        _iState = STATE_MENU;
    };

    this.gotoHelp = function () {
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };

    this.stopUpdate = function () {
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display", "block");
    };

    this.startUpdate = function () {
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display", "none");
    };

    this._update = function (event) {
        if (_bUpdate === false) {
            return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;

        if (s_iCntTime >= 1000) {
            s_iCurFps = s_iCntFps;
            s_iCntTime -= 1000;
            s_iCntFps = 0;
        }

        if (_iState === STATE_GAME) {
            _oGame.update();
        }

        s_oStage.update(event);

    };

    s_oMain = this;

    PAR_POINTS = oData.par_points;
    ADDED_POINTS = oData.added_points;

    _oData = oData;

    this.initContainer();
}
var s_bMobile;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_oPhysicsController;
var s_iCanvasResizeHeight;
var s_iCanvasResizeWidth;
var s_iCanvasOffsetHeight;
var s_iCanvasOffsetWidth;
var s_iCurLevel;
var s_iBackgroundLevel;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundTrack;
var s_oTweenController;
var s_oLocalStorage;