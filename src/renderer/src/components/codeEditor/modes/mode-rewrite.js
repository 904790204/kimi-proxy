ace.config.set('basePath', '/src/components/codeEditor/modes/')
ace.define(
  'ace/mode/rewrite',
  ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text_highlight_rules'],
  function (require, exports, module) {
    var oop = require('ace/lib/oop')
    var TextHighlightRules = require('ace/mode/text_highlight_rules').TextHighlightRules
    console.log(TextHighlightRules)
    var JsonHighlightRules = function () {
      this.HighlightRules = TextHighlightRules
      this.$rules = {
        start: [
          {
            token: 'comment',
            regex: /^\s*#.*$/
          },
          {
            token: 'keyword',
            regex: /^\s*!.*$/
          }
        ]
      }
    }
    var TextMode = require('ace/mode/text').Mode
    oop.inherits(JsonHighlightRules, TextHighlightRules)
    var Mode = function () {
      this.HighlightRules = JsonHighlightRules
    }
    oop.inherits(Mode, TextMode)
    ;(function () {}).call(Mode.prototype)

    exports.Mode = Mode

    // exports.JsonHighlightRules = JsonHighlightRules
  }
)

// ace.define(
//   'ace/mode/rewrite',
//   [
//     'require',
//     'exports',
//     'module',
//     'ace/lib/oop',
//     'ace/mode/text',
//     'ace/mode/rewrite_highlight_rules'
//   ],
//   function (require, exports, module) {
//     'use strict'
//     var oop = require('ace/lib/oop')
//     var TextMode = require('ace/mode/text').Mode
//     var GitignoreHighlightRules =
//       require('ace/mode/rewrite_highlight_rules').GitignoreHighlightRules
//     var Mode = function () {
//       this.HighlightRules = GitignoreHighlightRules
//       this.$behaviour = this.$defaultBehaviour
//     }
//     oop.inherits(Mode, TextMode)
//     ;(function () {
//       this.lineCommentStart = '#'
//       this.$id = 'ace/mode/gitignore'
//     }).call(Mode.prototype)
//     exports.Mode = Mode
//   }
// )
// ace.define(
//   'ace/mode/rewrite',
//   ['require', 'exports', 'module', 'ace/lib/oop', 'ace/mode/text'],
//   function (require, exports, module) {
//     var oop = require('ace/lib/oop')
//     var TextMode = require('ace/mode/text').Mode
//     var YourLanguageHighlightRules =
//       require('./rewrite_highlight_rules').RewriteHighlightRules

//     var RewriteMode = function () {
//       this.HighlightRules = YourLanguageHighlightRules
//     }

//     oop.inherits(RewriteMode, TextMode)

//     exports.Mode = RewriteMode
//   }
// )
