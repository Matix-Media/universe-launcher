import { basename } from "path";

const supportedModes = {
    ABAP: ["abap"],
    ABC: ["abc"],
    ActionScript: ["as"],
    ADA: ["ada|adb"],
    Apache_Conf: ["^htaccess|^htgroups|^htpasswd|^conf|htaccess|htgroups|htpasswd"],
    AsciiDoc: ["asciidoc|adoc"],
    Assembly_x86: ["asm|a"],
    AutoHotKey: ["ahk"],
    BatchFile: ["bat|cmd"],
    Bro: ["bro"],
    C_Cpp: ["cpp|c|cc|cxx|h|hh|hpp|ino"],
    C9Search: ["c9search_results"],
    Cirru: ["cirru|cr"],
    Clojure: ["clj|cljs"],
    Cobol: ["CBL|COB"],
    coffee: ["coffee|cf|cson|^Cakefile"],
    ColdFusion: ["cfm"],
    CSharp: ["cs"],
    Csound_Document: ["csd"],
    Csound_Orchestra: ["orc"],
    Csound_Score: ["sco"],
    CSS: ["css"],
    Curly: ["curly"],
    D: ["d|di"],
    Dart: ["dart"],
    Diff: ["diff|patch"],
    Dockerfile: ["^Dockerfile"],
    Dot: ["dot"],
    Drools: ["drl"],
    Dummy: ["dummy"],
    DummySyntax: ["dummy"],
    Eiffel: ["e|ge"],
    EJS: ["ejs"],
    Elixir: ["ex|exs"],
    Elm: ["elm"],
    Erlang: ["erl|hrl"],
    Forth: ["frt|fs|ldr|fth|4th"],
    Fortran: ["f|f90"],
    FTL: ["ftl"],
    Gcode: ["gcode"],
    Gherkin: ["feature"],
    Gitignore: ["^.gitignore"],
    Glsl: ["glsl|frag|vert"],
    Gobstones: ["gbs"],
    golang: ["go"],
    GraphQLSchema: ["gql"],
    Groovy: ["groovy"],
    HAML: ["haml"],
    Handlebars: ["hbs|handlebars|tpl|mustache"],
    Haskell: ["hs"],
    Haskell_Cabal: ["cabal"],
    haXe: ["hx"],
    Hjson: ["hjson"],
    HTML: ["html|htm|xhtml|vue|we|wpy"],
    HTML_Elixir: ["eex|html.eex"],
    HTML_Ruby: ["erb|rhtml|html.erb"],
    INI: ["ini|conf|cfg|prefs"],
    Io: ["io"],
    Jack: ["jack"],
    Jade: ["jade|pug"],
    Java: ["java"],
    JavaScript: ["js|jsm|jsx"],
    JSON: ["json|unvmeta|mcmeta"],
    JSONiq: ["jq"],
    JSP: ["jsp"],
    JSSM: ["jssm|jssm_state"],
    JSX: ["jsx"],
    Julia: ["jl"],
    Kotlin: ["kt|kts"],
    LaTeX: ["tex|latex|ltx|bib"],
    LESS: ["less"],
    Liquid: ["liquid"],
    Lisp: ["lisp"],
    LiveScript: ["ls"],
    LogiQL: ["logic|lql"],
    LSL: ["lsl"],
    Lua: ["lua"],
    LuaPage: ["lp"],
    Lucene: ["lucene"],
    Makefile: ["^Makefile|^GNUmakefile|^makefile|^OCamlMakefile|make"],
    Markdown: ["md|markdown"],
    Mask: ["mask"],
    MATLAB: ["matlab"],
    Maze: ["mz"],
    MEL: ["mel"],
    MUSHCode: ["mc|mush"],
    MySQL: ["mysql"],
    Nix: ["nix"],
    NSIS: ["nsi|nsh"],
    ObjectiveC: ["m|mm"],
    OCaml: ["ml|mli"],
    Pascal: ["pas|p"],
    Perl: ["pl|pm"],
    pgSQL: ["pgsql"],
    PHP: ["php|phtml|shtml|php3|php4|php5|phps|phpt|aw|ctp|module"],
    Pig: ["pig"],
    Powershell: ["ps1"],
    Praat: ["praat|praatscript|psc|proc"],
    Prolog: ["plg|prolog"],
    Properties: ["properties"],
    Protobuf: ["proto"],
    Python: ["py"],
    R: ["r"],
    Razor: ["cshtml|asp"],
    RDoc: ["Rd"],
    Red: ["red|reds"],
    RHTML: ["Rhtml"],
    RST: ["rst"],
    Ruby: ["rb|ru|gemspec|rake|^Guardfile|^Rakefile|^Gemfile"],
    Rust: ["rs"],
    SASS: ["sass"],
    SCAD: ["scad"],
    Scala: ["scala"],
    Scheme: ["scm|sm|rkt|oak|scheme"],
    SCSS: ["scss"],
    SH: ["sh|bash|^.bashrc"],
    SJS: ["sjs"],
    Smarty: ["smarty|tpl"],
    snippets: ["snippets"],
    Soy_Template: ["soy"],
    Space: ["space"],
    SQL: ["sql"],
    SQLServer: ["sqlserver"],
    Stylus: ["styl|stylus"],
    SVG: ["svg"],
    Swift: ["swift"],
    Tcl: ["tcl"],
    Tex: ["tex"],
    Text: ["txt"],
    Textile: ["textile"],
    Toml: ["toml"],
    TSX: ["tsx"],
    Twig: ["twig|swig"],
    Typescript: ["ts|typescript|str"],
    Vala: ["vala"],
    VBScript: ["vbs|vb"],
    Velocity: ["vm"],
    Verilog: ["v|vh|sv|svh"],
    VHDL: ["vhd|vhdl"],
    Wollok: ["wlk|wpgm|wtest"],
    XML: ["xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl|xaml"],
    XQuery: ["xq"],
    YAML: ["yaml|yml"],
    Django: ["html"],
};

var importedModes = false;

export default {
    /**
     * Import all Ace Components at once. BE CAREFUL! As this is a really heavy task.
     */
    async importHeavyItems() {
        await import("vue2-ace-editor");
        await this.importAceModes();
    },

    /**
     * Import all Ace Modes at once. BE CAREFUL! As this sums up to +6MB in total size
     */
    async importAceModes() {
        if (importedModes) return;
        importedModes = true;

        await import("brace/mode/ada");
        await import("brace/mode/applescript");
        await import("brace/mode/apache_conf");
        await import("brace/mode/asciidoc");
        await import("brace/mode/assembly_x86");
        await import("brace/mode/autohotkey");
        await import("brace/mode/batchfile");
        await import("brace/mode/bro");
        await import("brace/mode/c9search");
        await import("brace/mode/c_cpp");
        await import("brace/mode/cirru");
        await import("brace/mode/clojure");
        await import("brace/mode/cobol");
        await import("brace/mode/coffee");
        await import("brace/mode/coldfusion");
        await import("brace/mode/csharp");
        await import("brace/mode/css");
        await import("brace/mode/curly");
        await import("brace/mode/dart");
        await import("brace/mode/django");
        await import("brace/mode/d");
        await import("brace/mode/dockerfile");
        await import("brace/mode/dot");
        await import("brace/mode/drools");
        await import("brace/mode/eiffel");
        await import("brace/mode/ejs");
        await import("brace/mode/elixir");
        await import("brace/mode/elm");
        await import("brace/mode/erlang");
        await import("brace/mode/forth");
        await import("brace/mode/fortran");
        await import("brace/mode/ftl");
        await import("brace/mode/gcode");
        await import("brace/mode/gherkin");
        await import("brace/mode/gitignore");
        await import("brace/mode/glsl");
        await import("brace/mode/gobstones");
        await import("brace/mode/golang");
        await import("brace/mode/groovy");
        await import("brace/mode/haml");
        await import("brace/mode/handlebars");
        await import("brace/mode/haskell_cabal");
        await import("brace/mode/haskell");
        await import("brace/mode/haxe");
        await import("brace/mode/hjson");
        await import("brace/mode/html_elixir");
        await import("brace/mode/html");
        await import("brace/mode/html_ruby");
        await import("brace/mode/ini");
        await import("brace/mode/io");
        await import("brace/mode/jack");
        await import("brace/mode/jade");
        await import("brace/mode/java");
        await import("brace/mode/javascript");
        await import("brace/mode/jsoniq");
        await import("brace/mode/json");
        await import("brace/mode/jsp");
        await import("brace/mode/jsx");
        await import("brace/mode/julia");
        await import("brace/mode/kotlin");
        await import("brace/mode/latex");
        await import("brace/mode/less");
        await import("brace/mode/liquid");
        await import("brace/mode/lisp");
        await import("brace/mode/logiql");
        await import("brace/mode/lsl");
        await import("brace/mode/lua");
        await import("brace/mode/luapage");
        await import("brace/mode/lucene");
        await import("brace/mode/makefile");
        await import("brace/mode/markdown");
        await import("brace/mode/mask");
        await import("brace/mode/matlab");
        await import("brace/mode/maze");
        await import("brace/mode/mel");
        await import("brace/mode/mushcode");
        await import("brace/mode/mysql");
        await import("brace/mode/nix");
        await import("brace/mode/nsis");
        await import("brace/mode/objectivec");
        await import("brace/mode/ocaml");
        await import("brace/mode/pascal");
        await import("brace/mode/perl");
        await import("brace/mode/pgsql");
        await import("brace/mode/php");
        await import("brace/mode/powershell");
        await import("brace/mode/praat");
        await import("brace/mode/prolog");
        await import("brace/mode/properties");
        await import("brace/mode/protobuf");
        await import("brace/mode/python");
        await import("brace/mode/razor");
        await import("brace/mode/rdoc");
        await import("brace/mode/rhtml");
        await import("brace/mode/r");
        await import("brace/mode/rst");
        await import("brace/mode/ruby");
        await import("brace/mode/rust");
        await import("brace/mode/sass");
        await import("brace/mode/scad");
        await import("brace/mode/scala");
        await import("brace/mode/scheme");
        await import("brace/mode/scss");
        await import("brace/mode/sh");
        await import("brace/mode/sjs");
        await import("brace/mode/smarty");
        await import("brace/mode/snippets");
        await import("brace/mode/soy_template");
        await import("brace/mode/space");
        await import("brace/mode/sql");
        await import("brace/mode/sqlserver");
        await import("brace/mode/stylus");
        await import("brace/mode/svg");
        await import("brace/mode/swift");
        await import("brace/mode/tcl");
        await import("brace/mode/tex");
        await import("brace/mode/textile");
        await import("brace/mode/toml");
        await import("brace/mode/tsx");
        await import("brace/mode/twig");
        await import("brace/mode/typescript");
        await import("brace/mode/vala");
        await import("brace/mode/vbscript");
        await import("brace/mode/velocity");
        await import("brace/mode/verilog");
        await import("brace/mode/vhdl");
        await import("brace/mode/wollok");
        await import("brace/mode/xml");
        await import("brace/mode/xquery");
        await import("brace/mode/yaml");
        await import("brace/mode/abap");
        await import("brace/mode/abc");
        await import("brace/mode/actionscript");
        await import("brace/mode/lean");
        await import("brace/mode/live_script");
        await import("brace/mode/livescript");
        await import("brace/mode/mavens_mate_log");
        await import("brace/mode/mips_assembler");
        await import("brace/mode/mipsassembler");
        await import("brace/mode/swig");
        await import("brace/mode/diff");
        await import("brace/mode/plain_text");
        await import("brace/mode/text");
    },

    getLanguageByPath(path) {
        path = basename(path);
        for (let modeName in supportedModes) {
            let extensions = supportedModes[modeName][0];
            var re;
            if (/\^/.test(extensions)) {
                re =
                    extensions.replace(/\|(\^)?/g, function(a, b) {
                        return "$|" + (b ? "^" : "^.*\\.");
                    }) + "$";
            } else {
                re = "^.*\\.(" + extensions + ")$";
            }
            //console.log(re);
            if (path.match(new RegExp(re, "gi"))) {
                return modeName.toLowerCase();
            }
        }
    },
};
