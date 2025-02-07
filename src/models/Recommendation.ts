export class Recommendation {
  id: number;
  title: string;
  content: string;
  isCompleted: boolean;

  constructor(id: number, title: string, content: string) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.isCompleted = false;
  }

  markAsCompleted() {
    this.isCompleted = true;
  }

  markAsIncomplete() {
    this.isCompleted = false;
  }

  isComplete() {
    return this.isCompleted;
  }
}
