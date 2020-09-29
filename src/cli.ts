import * as commander from "commander";
import {tarnslate} from "./main";

const program = new commander.Command();
//控制命令行的版本\名称\信息
program.version('0.0.1')
  .name('fy')
  .usage('<English>')
  .arguments('<English>')
  .action(function(english){
    console.log(english)
    tarnslate(english)
  })

program.parse(program.argy);


