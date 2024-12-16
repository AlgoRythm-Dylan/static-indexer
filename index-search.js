function tokenize(string){
    return removeBlankTokens(string.split(" ").map(item => prepareToken(item)));
}

// Remove blank words (due to only being punctuation)
function removeBlankTokens(tokenList){
    return tokenList.filter(token => token.length > 0);
}

// Add punctiation to here as needed
const punctuationRegex = /[\?!,.'"&\n]/g;

function prepareToken(string){
    return string.toLowerCase().replaceAll(punctuationRegex, "");
}

function searchIndex(index, searchText){
    const scores = {};
    for(const token of new Set(tokenize(searchText))){
        let indexEntry = index.entries[token];
        if(!indexEntry) continue; // Word not in index
        for(const [document, count] of Object.entries(indexEntry)){
            if(scores[document]){
                scores[document] += count;
            }
            else {
                scores[document] = count;
            }
        }
    }
    let results = Object.entries(scores)
                        .map(item => { return { document: item[0], score: item[1] } })
                        .sort((a, b) => a.score - b.score);
    return results.reverse();
}