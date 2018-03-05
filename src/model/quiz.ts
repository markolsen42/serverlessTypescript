import { QuizItem } from "./quiz-item";

export class Quiz{
    constructor(public id:string, public quizItems: QuizItem[]){
    }
}