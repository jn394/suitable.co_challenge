// Command Line Entrys
// let entry = process.argv[2].split(',');

// console.log(entry);


let entry = process.argv[2].slice(1, process.argv[2].length - 1).split(',');

// console.log(entry);

let json = JSON.parse("[" + entry + "]")
console.log(json)
console.log(json[0])
console.log("Num in array " + json[0].length)
console.log(json[0][0])
console.log("Num in array " + json[0][1].length)

console.log(json[1])
console.log(json[2])

let answer = 0;

for (i = 0; i < json.length; i++) {
    if (json[i].length > 1) {
        console.log('yes')
        for (j = 0; j < json[i].length; j++) {
            console.log('yes')
            if (json[i][j].length > 1) {
                console.log('yes')
                for (k = 0; k < json[i][j].length; k++) {
                    console.log('yes')
                    answer = json[i][j][k] / json[i][j][k + 1]
                    json[i][j] = answer;
                    break
                }
            }
            console.log(json[i][j])
        }

    }

}

console.log(json)

// let mainArray = [];

// let newEntry = entry[0].replace(/\[/, "").parseInt();

// mainArray.push(newEntry);

// for (i = 0; i < entry.length; i++) {

//     let newEntry = "";

//     if (/\[/.test(entry[i])) {
//         let subArray = [];

//         console.log('yes')
//         newEntry = entry[i].replace(/\[/, "");
//         console.log(newEntry);
//         subArray.push(newEntry);
//     }
//     else {
//         mainArray.entry[i]
//     }
// }

// for (i = 0; i < entry.length; i++) {
//     let endArray = false;
//     let subArray = [];
//     if (/\[/.test(entry[i])) {
//         // let subArray = [];
//         newEntry = entry[i].replace(/\[/, "");
//         subArray.push(newEntry);
//         for (j = i + 1; j < entry.length; j++) {

//             if (/\[/.test(entry[j])) {
//                 newEntry = entry[j].replace(/\]/, "");
//                 subArray.push(newEntry);
//                 break
//             }
//             subArray.push(entry[j]);

//         }
//     }
//     console.log("subArray " + subArray);
// }