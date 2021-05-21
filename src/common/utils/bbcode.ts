//
//
// export const parseBBCode = (_message: string) => {
//   let message = _message.trim();
//
//   if (!message.length) {
//     return ''
//   }
//
//   const codes = [...bbCodes]
//
//   // for (const [from, to] of itemCodes) {
//   //
//   // }
//
//   const openTags = [];
//
//   message = message.replace(/\n/, '<br />')
//
//   let pos: number = -1
//   let last_pos: number = -1
//   let stop = false
//
//   while (!stop) {
//     last_pos = Math.max(pos, last_pos);
//     pos = message.indexOf('[', pos + 1);
//
//     // Failsafe.
//     if (pos < 0 || last_pos > pos) {
//       pos = message.length + 1;
//     }
//
//
//   }
//
//
// }
//
// const itemCodes = [
//   ['*', 'disc'],
//   ['@', 'disc'],
//   ['+', 'square'],
//   ['x', 'square'],
//   ['#', 'square'],
//   ['o', 'circle'],
//   ['O', 'circle'],
//   ['0', 'circle'],
// ]
//
//
// const bbCodes = [
//   {
//     "tag": "abbr",
//     "type": "unparsed_equals",
//     "before": "<abbr title=\"$1\">",
//     "after": "<\/abbr>",
//     "quoted": "optional",
//     "disabled_after": " ($1)"
//   },
//   {
//     "tag": "acronym",
//     "type": "unparsed_equals",
//     "before": "<acronym title=\"$1\">",
//     "after": "<\/acronym>",
//     "quoted": "optional",
//     "disabled_after": " ($1)"
//   },
//   {
//     "tag": "admin",
//     "type": "unparsed_content",
//     "content": "$1",
//     "block_level": true,
//     "validate": {}
//   },
//   {
//     "tag": "admin",
//     "type": "unparsed_equals_content",
//     "content": "$1",
//     "block_level": true,
//     "validate": {}
//   },
//   {
//     "tag": "anchor",
//     "type": "unparsed_equals",
//     "test": "[#]?([A-Za-z0-9_\\-\\.]*)\\]",
//     "before": "<span id=\"post_$1\">",
//     "after": "<\/span>"
//   },
//   {
//     "tag": "hash",
//     "type": "unparsed_equals",
//     "block_level": true,
//     "before": "<span id=\"post_ $1\">",
//     "after": "<\/span>"
//   },
//   {
//     "tag": "b",
//     "before": "<strong>",
//     "after": "<\/strong>"
//   },
//   {
//     "tag": "bdo",
//     "type": "unparsed_equals",
//     "before": "<bdo dir=\"$1\">",
//     "after": "<\/bdo>",
//     "test": "(rtl|ltr)\\]",
//     "block_level": true
//   },
//   {
//     "tag": "black",
//     "before": "<span style=\"color: black;\" class=\"bbc_color\">",
//     "after": "<\/span>"
//   },
//   {
//     "tag": "blue",
//     "before": "<span style=\"color: blue;\" class=\"bbc_color\">",
//     "after": "<\/span>"
//   },
//   {
//     "tag": "br",
//     "type": "closed",
//     "content": "<br \/>"
//   },
//   {
//     "tag": "center",
//     "before": "<div align=\"center\">",
//     "after": "<\/div>",
//     "block_level": true
//   },
//   {
//     "tag": "code",
//     "type": "unparsed_equals_content",
//     "content": "$1",
//     "validate": "\u0000lambda_1",
//     "block_level": true
//   },
//   {
//     "tag": "code",
//     "type": "unparsed_content",
//     "content": "$1",
//     "validate": "\u0000lambda_2",
//     "block_level": true
//   },
//   {
//     "tag": "color",
//     "type": "unparsed_equals",
//     "test": "(#[\\da-fA-F]{3}|#[\\da-fA-F]{6}|[A-Za-z]{1,20}|rgb\\(\\d{1,3}, ?\\d{1,3}, ?\\d{1,3}\\))\\]",
//     "before": "<span style=\"color: $1;\" class=\"bbc_color\">",
//     "after": "<\/span>"
//   },
//   {
//     "tag": "email",
//     "type": "unparsed_content",
//     "content": "<a href=\"mailto:$1\" class=\"bbc_email\">$1<\/a>",
//     "validate": "\u0000lambda_3"
//   },
//   {
//     "tag": "email",
//     "type": "unparsed_equals",
//     "before": "<a href=\"mailto:$1\" class=\"bbc_email\">",
//     "after": "<\/a>",
//     "disallow_children": [
//       "email",
//       "ftp",
//       "url",
//       "iurl"
//     ],
//     "disabled_after": " ($1)"
//   },
//   {
//     "tag": "flash",
//     "type": "unparsed_commas_content",
//     "test": "\\d+,\\d+\\]",
//     "content": "<embed type=\"application\/x-shockwave-flash\" src=\"$1\" width=\"$2\" height=\"$3\" play=\"true\" loop=\"true\" quality=\"high\" AllowScriptAccess=\"never\" \/><noembed><a href=\"$1\" target=\"_blank\" class=\"new_win\">$1<\/a><\/noembed>",
//     "validate": "\u0000lambda_4",
//     "disabled_content": "<a href=\"$1\" target=\"_blank\" class=\"new_win\">$1<\/a>"
//   },
//   {
//     "tag": "font",
//     "type": "unparsed_equals",
//     "test": "[A-Za-z0-9_,\\-\\s]+?\\]",
//     "before": "<span style=\"font-family: $1;\" class=\"bbc_font\">",
//     "after": "<\/span>"
//   },
//   {
//     "tag": "ftp",
//     "type": "unparsed_content",
//     "content": "<a href=\"$1\" class=\"bbc_ftp new_win\" target=\"_blank\">$1<\/a>",
//     "validate": "\u0000lambda_5"
//   },
//   {
//     "tag": "ftp",
//     "type": "unparsed_equals",
//     "before": "<a href=\"$1\" class=\"bbc_ftp new_win\" target=\"_blank\">",
//     "after": "<\/a>",
//     "validate": "\u0000lambda_6",
//     "disallow_children": [
//       "email",
//       "ftp",
//       "url",
//       "iurl"
//     ],
//     "disabled_after": " ($1)"
//   },
//   {
//     "tag": "glow",
//     "type": "unparsed_commas",
//     "test": "[#0-9a-zA-Z\\-]{3,12},([012]\\d{1,2}|\\d{1,2})(,[^]]+)?\\]",
//     "before": "<span style=\"text-shadow: $1 1px 1px 1px\">",
//     "after": "<\/span>"
//   },
//   {
//     "tag": "green",
//     "before": "<span style=\"color: green;\" class=\"bbc_color\">",
//     "after": "<\/span>"
//   },
//   {
//     "tag": "html",
//     "type": "unparsed_content",
//     "content": "$1",
//     "block_level": true,
//     "disabled_content": "$1"
//   },
//   {
//     "tag": "gmod",
//     "type": "unparsed_content",
//     "content": "$1",
//     "block_level": true,
//     "validate": {}
//   },
//   {
//     "tag": "gmod",
//     "type": "unparsed_equals_content",
//     "content": "$1",
//     "block_level": true,
//     "validate": {}
//   },
//   {
//     "tag": "hr",
//     "type": "closed",
//     "content": "<hr \/>",
//     "block_level": true
//   },
//   {
//     "tag": "i",
//     "before": "<em>",
//     "after": "<\/em>"
//   },
//   {
//     "tag": "img",
//     "type": "unparsed_content",
//     "parameters": {
//       "alt": {
//         "optional": true
//       },
//       "width": {
//         "optional": true,
//         "value": "width:$1; ",
//         "match": "([\\d\\.]+[\\%]{0,1})"
//       },
//       "height": {
//         "optional": true,
//         "value": "height:$1; ",
//         "match": "([\\d\\.]+[\\%]{0,1})"
//       },
//       "border": {
//         "optional": true,
//         "value": " bbc_border_$1px",
//         "match": "([1,2,3,4,5])"
//       }
//     },
//     "content": "<img src=\"$1\" alt=\"{alt}\" style=\"{width}{height}\" class=\"bbc_img{border}\" \/>",
//     "validate": "\u0000lambda_7",
//     "disabled_content": "($1)"
//   },
//   {
//     "tag": "img",
//     "type": "unparsed_content",
//     "content": "<img src=\"$1\" alt=\"\" class=\"bbc_img\" \/>",
//     "validate": "\u0000lambda_8",
//     "disabled_content": "($1)"
//   },
//   {
//     "tag": "user",
//     "type": "unparsed_content",
//     "content": "<span class=\"member_name\">$1<\/span>",
//     "disabled_content": "($1)"
//   },
//   {
//     "tag": "iurl",
//     "type": "unparsed_content",
//     "content": "<a href=\"$1\" class=\"bbc_link\">$1<\/a>",
//     "validate": "\u0000lambda_9"
//   },
//   {
//     "tag": "iurl",
//     "type": "unparsed_equals",
//     "before": "<a href=\"$1\" class=\"bbc_link\">",
//     "after": "<\/a>",
//     "validate": "\u0000lambda_10",
//     "disallow_children": [
//       "email",
//       "ftp",
//       "url",
//       "iurl"
//     ],
//     "disabled_after": " ($1)"
//   },
//   {
//     "tag": "left",
//     "before": "<div style=\"text-align: left;\">",
//     "after": "<\/div>",
//     "block_level": true
//   },
//   {
//     "tag": "justify",
//     "before": "<div align=\"justify\">",
//     "after": "<\/div>",
//     "block_level": true
//   },
//   {
//     "tag": "li",
//     "before": "<li>",
//     "after": "<\/li>",
//     "trim": "outside",
//     "require_parents": [
//       "list"
//     ],
//     "block_level": true,
//     "disabled_before": "",
//     "disabled_after": "<br \/>"
//   },
//   {
//     "tag": "list",
//     "before": "<ul class=\"bbc_list\">",
//     "after": "<\/ul>",
//     "trim": "inside",
//     "require_children": [
//       "li",
//       "list"
//     ],
//     "block_level": true
//   },
//   {
//     "tag": "list",
//     "parameters": {
//       "type": {
//         "match": "(none|disc|circle|square|decimal|decimal-leading-zero|lower-roman|upper-roman|lower-alpha|upper-alpha|lower-greek|lower-latin|upper-latin|hebrew|armenian|georgian|cjk-ideographic|hiragana|katakana|hiragana-iroha|katakana-iroha)"
//       }
//     },
//     "before": "<ul class=\"bbc_list\" style=\"list-style-type: {type};\">",
//     "after": "<\/ul>",
//     "trim": "inside",
//     "require_children": [
//       "li"
//     ],
//     "block_level": true
//   },
//   {
//     "tag": "ltr",
//     "before": "<div dir=\"ltr\">",
//     "after": "<\/div>",
//     "block_level": true
//   },
//   {
//     "tag": "me",
//     "type": "unparsed_equals",
//     "before": "<div class=\"meaction\">* $1 ",
//     "after": "<\/div>",
//     "quoted": "optional",
//     "block_level": true,
//     "disabled_before": "\/me ",
//     "disabled_after": "<br \/>"
//   },
//   {
//     "tag": "mod",
//     "type": "unparsed_content",
//     "content": "$1",
//     "block_level": true,
//     "validate": {}
//   },
//   {
//     "tag": "mod",
//     "type": "unparsed_equals_content",
//     "content": "$1",
//     "block_level": true,
//     "validate": {}
//   },
//   {
//     "tag": "move",
//     "before": "<marquee>",
//     "after": "<\/marquee>",
//     "block_level": true,
//     "disallow_children": [
//       "move"
//     ]
//   },
//   {
//     "tag": "nobbc",
//     "type": "unparsed_content",
//     "content": "$1"
//   },
//   {
//     "tag": "php",
//     "type": "unparsed_content",
//     "content": "<span class=\"phpcode\">$1<\/span>",
//     "validate": "\u0000lambda_11",
//     "block_level": false,
//     "disabled_content": "$1"
//   },
//   {
//     "tag": "pre",
//     "before": "<pre>",
//     "after": "<\/pre>"
//   },
//   {
//     "tag": "quote",
//     "before": "<div class=\"content_quote\"><div class=\"row_quote\"><\/div><div class=\"message_quote\">",
//     "after": "<\/div><\/div>",
//     "block_level": true
//   },
//   {
//     "tag": "quote",
//     "parameters": {
//       "author": {
//         "match": "(.{1,192}?)",
//         "quoted": true
//       }
//     },
//     "before": "<blockquote class=\"content_quote\"><header>\u0418\u0441\u0442\u043e\u0447\u043d\u0438\u043a: $1<\/header><p>",
//     "after": "<\/p><\/blockquote>",
//     "block_level": true
//   },
//   {
//     "tag": "quote",
//     "type": "parsed_equals",
//     "before": "<blockquote class=\"content_quote\"><header>\u0410\u0432\u0442\u043e\u0440: <b>{author}<\/b>, \u0414\u0430\u0442\u0430: {date}, \u0418\u0441\u0442\u043e\u0447\u043d\u0438\u043a: <a href=\"###\/?{link}\"><\/header><p>",
//     "after": "<\/p><\/blockquote>",
//     "quoted": "optional",
//     "parsed_tags_allowed": [
//       "url",
//       "iurl",
//       "ftp"
//     ],
//     "block_level": true
//   },
//   {
//     "tag": "quote",
//     "parameters": {
//       "author": {
//         "match": "([^<>]{1,192}?)"
//       },
//       "link": {
//         "match": "(?:board=\\d+;)?((?:topic|threadid)=[\\dmsg#\\.\/]{1,40}(?:;start=[\\dmsg#\\.\/]{1,40})?|action=profile;u=\\d+)"
//       },
//       "date": {
//         "match": "(\\d+)",
//         "validate": "timeformat"
//       }
//     },
//     "before": "<blockquote class=\"content_quote\"><header>\u0410\u0432\u0442\u043e\u0440: <b>{author}<\/b>, \u0414\u0430\u0442\u0430: <a href=\"###\/?{link}\">{date}<\/a><\/header><p>",
//     "after": "<\/p><\/blockquote>",
//     "block_level": true
//   },
//   {
//     "tag": "quote",
//     "parameters": {
//       "author": {
//         "match": "(.{1,192}?)"
//       }
//     },
//     "before": "<blockquote class=\"content_quote\"><header>\u0410\u0432\u0442\u043e\u0440: <b>{author}<\/b><\/header><p>",
//     "after": "<\/p><\/blockquote>",
//     "block_level": true
//   },
//   {
//     "tag": "red",
//     "before": "<span style=\"color: red;\" class=\"bbc_color\">",
//     "after": "<\/span>"
//   },
//   {
//     "tag": "right",
//     "before": "<div style=\"text-align: right;\">",
//     "after": "<\/div>",
//     "block_level": true
//   },
//   {
//     "tag": "rtl",
//     "before": "<div dir=\"rtl\">",
//     "after": "<\/div>",
//     "block_level": true
//   },
//   {
//     "tag": "s",
//     "before": "<del>",
//     "after": "<\/del>"
//   },
//   {
//     "tag": "shadow",
//     "type": "unparsed_commas",
//     "test": "[#0-9a-zA-Z\\-]{3,12},(left|right|top|bottom|[0123]\\d{0,2})\\]",
//     "before": "<span style=\"text-shadow: $1 $2\">",
//     "after": "<\/span>",
//     "validate": "\u0000lambda_12"
//   },
//   {
//     "tag": "size",
//     "type": "unparsed_equals",
//     "test": "([1-9][\\d]?p[xt]|(?:x-)?small(?:er)?|(?:x-)?large[r]?|(0\\.[1-9]|[1-9](\\.[\\d][\\d]?)?)?em)\\]",
//     "before": "<span style=\"font-size: $1;\" class=\"bbc_size\">",
//     "after": "<\/span>"
//   },
//   {
//     "tag": "size",
//     "type": "unparsed_equals",
//     "test": "[1-7]\\]",
//     "before": "<span style=\"font-size: $1;\" class=\"bbc_size\">",
//     "after": "<\/span>",
//     "validate": "\u0000lambda_13"
//   },
//   {
//     "tag": "smg",
//     "type": "closed",
//     "content": ""
//   },
//   {
//     "tag": "sub",
//     "before": "<sub>",
//     "after": "<\/sub>"
//   },
//   {
//     "tag": "sup",
//     "before": "<sup>",
//     "after": "<\/sup>"
//   },
//   {
//     "tag": "spoiler",
//     "block_level": true,
//     "before": "<fieldset class=\"spoiler\" onmouseover=\"this.lastChild.style.display = 'block';\" onmouseout=\"this.lastChild.style.display='none'\"><legend><b><\/b> <small><\/small><\/legend><div class=\"spoilerbody\" style=\"display: none\">",
//     "after": "<\/div><\/fieldset>",
//     "disabled_before": "<div style=\"display: none;\">",
//     "disabled_after": "<\/div>"
//   },
//   {
//     "tag": "spoiler",
//     "type": "unparsed_equals",
//     "block_level": true,
//     "before": "<fieldset class=\"spoiler\" onmouseover=\"this.lastChild.style.display = 'block';\" onmouseout=\"this.lastChild.style.display='none'\"><legend><b>$1<\/b> <small><\/small><\/legend><div class=\"spoilerbody\" style=\"display: none\">",
//     "after": "<\/div><\/fieldset>",
//     "disabled_before": "<div style=\"display: none;\">",
//     "disabled_after": "<\/div>"
//   },
//   {
//     "tag": "time",
//     "type": "unparsed_content",
//     "content": "$1",
//     "validate": "\u0000lambda_14"
//   },
//   {
//     "tag": "table",
//     "before": "<table class=\"bbc_table\">",
//     "after": "<\/table>",
//     "block_level": true
//   },
//   {
//     "tag": "td",
//     "before": "<td>",
//     "after": "<\/td>",
//     "block_level": true
//   },
//   {
//     "tag": "th",
//     "before": "<th>",
//     "after": "<\/th>",
//     "block_level": true
//   },
//   {
//     "tag": "tr",
//     "before": "<tr>",
//     "after": "<\/tr>",
//     "block_level": true
//   },
//   {
//     "tag": "tt",
//     "before": "<tt class=\"bbc_tt\">",
//     "after": "<\/tt>"
//   },
//   {
//     "tag": "u",
//     "before": "<u>",
//     "after": "<\/u>"
//   },
//   {
//     "tag": "url",
//     "type": "unparsed_content",
//     "content": "nox",
//     "validate": "\u0000lambda_15"
//   },
//   {
//     "tag": "url",
//     "type": "unparsed_equals",
//     "before": "<a href=\"$1\" class=\"bbc_link new_win\" target=\"_blank\">",
//     "after": "<\/a>",
//     "validate": "\u0000lambda_16",
//     "disallow_children": [
//       "email",
//       "ftp",
//       "url",
//       "iurl"
//     ],
//     "disabled_after": " ($1)"
//   },
//   {
//     "tag": "white",
//     "before": "<span style=\"color: white;\" class=\"bbc_color\">",
//     "after": "<\/span>"
//   },
//   {
//     "tag": "error",
//     "before": "<div class=\"error_bbc\">",
//     "after": "<\/div>"
//   },
//   {
//     "tag": "warning",
//     "before": "<div class=\"warning_bbc\">",
//     "after": "<\/div>"
//   },
//   {
//     "tag": "okay",
//     "before": "<div class=\"okay_bbc\">",
//     "after": "<\/div>"
//   },
//   {
//     "tag": "info",
//     "before": "<div class=\"info_bbc\">",
//     "after": "<\/div>"
//   },
//   {
//     "tag": "floatleft",
//     "before": "<div class=\"floatleft\">",
//     "after": "<\/div>",
//     "block_level": true
//   },
//   {
//     "tag": "floatleft",
//     "parameters": {
//       "width": {
//         "optional": true,
//         "value": "style=\"width:$1;\"",
//         "match": "([\\d]+[\\%]{0,1})"
//       },
//       "border": {
//         "optional": true,
//         "value": "bbc_border_$1px\"",
//         "match": "([1,2,3,4,5])"
//       }
//     },
//     "before": "<div {width} class=\"pull-left {border}\">",
//     "after": "<\/div>",
//     "block_level": true
//   },
//   {
//     "tag": "floatright",
//     "before": "<div class=\"pull-right\">",
//     "after": "<\/div>",
//     "block_level": true
//   },
//   {
//     "tag": "floatright",
//     "parameters": {
//       "width": {
//         "optional": true,
//         "value": "style=\"width:$1;\"",
//         "match": "([\\d]+[\\%]{0,1})"
//       },
//       "border": {
//         "optional": true,
//         "value": "bbc_border_$1px\"",
//         "match": "([1,2,3,4,5])"
//       }
//     },
//     "before": "<div {width} class=\"pull-right {border}\">",
//     "after": "<\/div>",
//     "block_level": true
//   },
//   {
//     "tag": "clear",
//     "type": "closed",
//     "content": "<br class=\"clearfix clear\" \/>",
//     "block_level": true
//   },
//   {
//     "tag": "hr_clear",
//     "type": "closed",
//     "content": "<hr class=\"clearfix clear\" \/>",
//     "block_level": true
//   },
//   {
//     "tag": "small",
//     "before": "<div class=\"smalltext\">",
//     "after": "<\/div>",
//     "block_level": true
//   }
// ]
