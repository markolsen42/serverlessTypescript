export class AnswerOption{
    constructor(public label: string, public possibleAnswer: string){

    }
}

export class QuizItem{
    constructor(private question: string, public answerOptions: AnswerOption[]){       
    }
}