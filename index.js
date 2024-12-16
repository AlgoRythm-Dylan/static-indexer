import { readdir, readFile, writeFile } from "node:fs/promises";
import { argv } from "node:process";
import { join } from "node:path";
import { load } from "cheerio";

/*

    Index structure:

    word > document > count

    {
        "tiger":
        {
            "page1.html": 1,
            "page2.html": 5
        }
    }

*/

class Index {
    constructor(){
        this.totalDocumentCount = 0;
        this.entries = {};
    }
    record(word, document){
        let entry = this.entries[word];
        if(entry){
            // Add to this entry
            let internalEntry = this.entries[word][document];
            if(!internalEntry){
                // This word hasn't been recorded in this
                // document yet
                this.entries[word][document] = 1;
            }
            else {
                // This word has been recorded in the document
                // so increase the count
                this.entries[word][document]++;
            }
        }
        else {
            // Add a new entry
            let newEntry = {};
            newEntry[document] = 1;
            this.entries[word] = newEntry;
        }
    }
}

function tokenize(string){
    return removeUninterestingTokens(string.split(" ").map(item => prepareToken(item)));
}

// This is intended for technical documentation with SQL queries
// so words like "WITH" and "WHERE" should be indexed
const FILLER_WORDS = ["the", "is", "a"]

// Remove blank words (due to only being punctuation) and any fillter words
// such as "the"
function removeUninterestingTokens(tokenList){
    return tokenList.filter(token => token.length > 0 && FILLER_WORDS.indexOf(token) === -1);
}

// Add punctiation to here as needed
const punctuationRegex = /[\?!,.'"&\n]/g;

function prepareToken(string){
    return string.toLowerCase().replaceAll(punctuationRegex, "");
}

const directoryToScan = argv[2] ?? ".";
const documentBodyQuery = argv[3] ?? "body";
const index = new Index();

for(const file of await readdir(directoryToScan)){
    if(file.toLowerCase().endsWith(".html")){
        index.totalDocumentCount++;
        const text = await readFile(join(directoryToScan, file));
        const $ = load(text);
        const body = $(documentBodyQuery);
        for(const token of tokenize(body.text())){
            index.record(token, file);
        }
    }
}

await writeFile("index.json", JSON.stringify(index));