#!/bin/bash node
import program from 'commander';
import { Project } from "ts-morph";
const pkg = require('../package.json');
program.version(pkg.version)
const args = process.argv;
program.parse(args)

const project = new Project();
debugger;