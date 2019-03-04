// Command Line Entrys
let entry = process.argv[2].split(',');

console.log(entry);
console.log(typeof (entry));

let mainArray = [];

// let newEntry = entry[0].replace(/\[/, "").parseInt();

// mainArray.push(newEntry);

for (i = 0; i < entry.length; i++) {

    let newEntry = "";

    if (/\[/.test(entry[i])) {
        let subArray = [];

        console.log('yes')
        newEntry = entry[i].replace(/\[/, "");
        console.log(newEntry);
        subArray.push(newEntry);
    }
    else {
        mainArray.entry[i]
    }
}