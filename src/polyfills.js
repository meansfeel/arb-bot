import 'process/browser';
import { Buffer } from 'buffer';
import 'stream-browserify';
import 'stream-http';
import 'https-browserify';
import 'os-browserify/browser';

window.process = process;
window.Buffer = Buffer;

