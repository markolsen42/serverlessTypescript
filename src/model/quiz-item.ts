export class AnswerOption{
    constructor(public label: string, public possibleAnswer: string){

    }
}

export class AnswerOptions{
    public options: AnswerOption[] = [];
    
    public add(answerOption: AnswerOption){
        var unique: boolean = true;
        this.options.forEach(element => {
            if (answerOption.label.trim().toLowerCase() === element.label.trim().toLowerCase() || 
            answerOption.possibleAnswer.trim().toLowerCase() === element.possibleAnswer.trim().toLowerCase()){
                unique = false;
            }
        });
        if (unique){
            this.options.push(answerOption);
        } else {
            console.log("error repeated option " + JSON.stringify(answerOption));
        }
    }
}

export class Question{
    constructor(private quizName: string, public questionNumber: number,public question: string, public options: AnswerOptions, public answer: string){
        if (! options.options.some(element => {
            return (element.label.trim().toLowerCase() === answer.trim().toLowerCase())
        })  ){
            console.log("Error Answer not present among options " + answer);
        } 
    }
}