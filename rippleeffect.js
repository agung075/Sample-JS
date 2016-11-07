/* Material Design Ripple Effect */
/* Copyright 2014+, Federico Zivolo, LICENSE at https://github.com/FezVrasta/bootstrap-material-design/blob/master/LICENSE.md */
/* globals jQuery, navigator */

(function($, window, document, undefined) {
  "use strict";
  var ripples = "ripples";
  var self = null;
  var defaults = {};
  function Ripples(element) {
    self = this;
    this.element = $(element);
    this._defaults = defaults;
    this._name = ripples;
    this.init();
  }
  Ripples.prototype.init = function() {
    var $element  = this.element;
    $element.on("mousedown touchstart", function(event) {
      if(self.isTouch() && event.type === "mousedown") {
        return;
      }
      if(!($element.find(".ripple-effect__container").length)) {
        $element.append("<div class=\"ripple-effect__container\"></div>");
      }
      var $wrapper = $element.children(".ripple-effect__container");
      var relY = self.getRelY($wrapper, event);
      var relX = self.getRelX($wrapper, event);
      if(!relY && !relX) {
        return;
      }
      var rippleColor = self.getRipplesColor($element);
      var $ripple = $("<div></div>");
      $ripple
      .addClass("ripple")
      .css({
        "left": relX,
        "top": relY,
        "background-color": rippleColor
      });
      $wrapper.append($ripple);
      (function() { return window.getComputedStyle($ripple[0]).opacity; })();
      self.rippleOn($element, $ripple);
      setTimeout(function() {
        self.rippleEnd($ripple);
      }, 500);
      $element.on("mouseup mouseleave touchend", function() {
        $ripple.data("mousedown", "off");

        if($ripple.data("animating") === "off") {
          self.rippleOut($ripple);
        }
      });
    });
  };
  Ripples.prototype.getNewSize = function($element, $ripple) {
    return (Math.max($element.outerWidth(), $element.outerHeight()) / $ripple.outerWidth()) * 2.5;
  };
  Ripples.prototype.getRelX = function($wrapper,  event) {
    var wrapperOffset = $wrapper.offset();
    if(!self.isTouch()) {
      return event.pageX - wrapperOffset.left;
    } else {
      event = event.originalEvent;
      if(event.touches.length === 1) {
        return event.touches[0].pageX - wrapperOffset.left;
      }
      return false;
    }
  };
  Ripples.prototype.getRelY = function($wrapper, event) {
    var wrapperOffset = $wrapper.offset();
    if(!self.isTouch()) {
      return event.pageY - wrapperOffset.top;
    } else {
      event = event.originalEvent;
      if(event.touches.length === 1) {
        return event.touches[0].pageY - wrapperOffset.top;
      }
      return false;
    }
  };
  Ripples.prototype.getRipplesColor = function($element) {
    var color = $element.data("ripple-color") ? $element.data("ripple-color") : window.getComputedStyle($element[0]).color;
    return color;
  };
  Ripples.prototype.hasTransitionSupport = function() {
    var thisBody  = document.body || document.documentElement;
    var thisStyle = thisBody.style;
    var support = (
      thisStyle.transition !== undefined ||
      thisStyle.WebkitTransition !== undefined ||
      thisStyle.MozTransition !== undefined ||
      thisStyle.MsTransition !== undefined ||
      thisStyle.OTransition !== undefined
    );
    return support;
  };
  Ripples.prototype.isTouch = function() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };
  Ripples.prototype.rippleEnd = function($ripple) {
    $ripple.data("animating", "off");
    if($ripple.data("mousedown") === "off") {
      self.rippleOut($ripple);
    }
  };
  Ripples.prototype.rippleOut = function($ripple) {
    $ripple.off();
    if(self.hasTransitionSupport()) {
      $ripple.addClass("ripple-out");
    } else {
      $ripple.animate({"opacity": 0}, 100, function() {
        $ripple.trigger("transitionend");
      });
    }
    $ripple.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
      $ripple.remove();
    });
  };
  Ripples.prototype.rippleOn = function($element, $ripple) {
    var size = self.getNewSize($element, $ripple);
    if(self.hasTransitionSupport()) {
      $ripple
      .css({
        "-ms-transform": "scale(" + size + ")",
        "-moz-transform": "scale(" + size + ")",
        "-webkit-transform": "scale(" + size + ")",
        "transform": "scale(" + size + ")"
      })
      .addClass("ripple-on")
      .data("animating", "on")
      .data("mousedown", "on");
    } else {
      $ripple.animate({
        "width": Math.max($element.outerWidth(), $element.outerHeight()) * 2,
        "height": Math.max($element.outerWidth(), $element.outerHeight()) * 2,
        "margin-left": Math.max($element.outerWidth(), $element.outerHeight()) * (-1),
        "margin-top": Math.max($element.outerWidth(), $element.outerHeight()) * (-1),
        "opacity": 0.2
      }, 500, function() {
        $ripple.trigger("transitionend");
      });
    }
  };
  $.fn.ripples = function(options) {
    return this.each(function() {
      if(!$.data(this, "plugin_" + ripples)) {
        $.data(this, "plugin_" + ripples, new Ripples(this));
      }
    });
  };
})(jQuery, window, document);
