import chalk from 'chalk';
import fs from 'fs';

export const parseInput = (fileName?: string) => {
    // If file is missing, input is taken consuming input stream
    if (!fileName) {
        return JSON.parse(fs.readFileSync(0, 'utf-8'));
    }

    // If file doesn't exist exit with error
    if (!fs.existsSync(fileName)) {
        console.log(chalk.bold.red("The file does not exist."));
        return;
    }

    // Get input from specified file
    return JSON.parse(fs.readFileSync(fileName, 'utf8'));
}

export const writeOutput = (description: string, result?: any, outputFile?: string) => {
    console.log(chalk.bold.green(description));
    if(result){
        console.log(JSON.stringify(result, undefined, 2));
    }
    if (outputFile) {
        fs.writeFileSync(outputFile, JSON.stringify(result, undefined, 2));
    }
}

export const checkProperty = (property: any, propertyName?: string) => {
    if(!property){
        throw new Error(chalk.bold.red(`${propertyName ? propertyName : 'The required property for this command'} does not exist in provided file`));
    }
}