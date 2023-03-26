import { createEffect } from "solid-js";
import { openMenu } from "../../../scripts/store";
import { terminalSignal } from "../../../scripts/store";
import { createFile } from "../../../scripts/scripts";
const Debugger = () => {
    let term;
    let progress;
    let animation;

    const [menu] = openMenu;
    const [_terminal, setTerminal] = terminalSignal;
    createEffect(()=>{
        if(_terminal.echo){
            term?.echo('> '+_terminal.echo)
        }
        setTerminal({echo:null});
    });

    createEffect(()=>{
        if(_terminal.import){
            term.import_view(_terminal.logConfig);
            setTerminal({import:false, logConfig:null});
        }
    });

    createEffect(()=>{
        if(_terminal.export){
            createFile('logConfig',term.export_view());
            setTerminal({export:false});
        }
    });

    createEffect(()=>{
        if(_terminal.progressBar && !_terminal.clear){
                if(progress)
                    progress.percent = Math.min(_terminal.progressPercent,100);
                else{
                    term?.exec('progress ' + _terminal.progressWidth, true)
                    progress.percent = _terminal.progressPercent;
                }
        }
        
        if(_terminal.clear){
            if (animation) {
                progress.stop();
                animation = false;
                term.resume();
                progress = null;
            }
            term.clear();
            setTerminal({clear: false, progressBar: false, progressPercent:0});
        }
    });
    createEffect(()=>{
        if(menu.controls){
            term = $('#debugger').terminal({
                echo(val){
                    this.echo(val)
                },
                progress(width) {
                    const render = percent => progress_bar(width, percent);
                    progress = new Progress({term, render});
                    animation = true;
                    this.pause(true);
                    progress.start().then(() => {
                        animation = false;
                        this.resume();
                        progress = null;
                        setTerminal({progressBar: false, progressPercent:0});
                    })
                }
            }, {
                onInit:function(){
                    this.clear();
                },
                completion: true,
                keydown: function(e, term) {
                    if (animation) {
                        if (e.which == 68 && e.ctrlKey) { // CTRL+D
                            progress.stop();
                            animation = false;
                            this.resume();
                            progress = null;
                        }
                    }
                }
            });

            function progress_bar(width, percent) {
                const size = Math.round(width * percent / 100);
                let left = '', taken = '', i;
                for (i=size; i--;) {
                    taken += '=';
                }
                if (taken.length > 0) {
                    taken = taken.replace(/=$/, '>');
                }
                for (i=width-size; i--;) {
                    left += ' ';
                }
                return '[' + taken + left + '] ' + percent + '%';
            }
            
            class Progress {
                constructor({term, render}) {
                    this._percent = 0;
                    this._term = term;
                    this._render = render;
                }
                
                set percent(val){
                    this._percent = val;
                }

                get percent(){ return this._percent};

                _progress(percent) {
                    return this._render(percent);
                }

                start() {
                    const self = this;
                    self._prompt = self._term.get_prompt();
                    return new Promise(resolve => {
                        (function loop() {
                            self._string = self._progress(self._percent);
                            self._term.set_prompt(self._string);
                            if (self._percent < 100) {
                                self._timer = setTimeout(loop, 100);
                            } else {
                                term.echo(self._progress(self._percent)).set_prompt(self._prompt);
                                resolve();
                            }
                        })();
                    });
                }
                stop() {
                    clearTimeout(this._timer);
                    term.echo(this._string).set_prompt(this._prompt);
                }
            }

            
        } else {
           
        }
    })
  return <div id="debugger"></div>
}

export default Debugger