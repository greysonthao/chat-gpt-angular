import { Component } from '@angular/core';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { environment } from 'src/environments/environment';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  value!: string;
  aiMessage!: string | null;
  isLoading: boolean = false;
  memory = new BufferMemory();

  ngOnInit() {}

  constructor() {}

  async handleSubmitChat() {
    const res = await this.getOpenAIResponse(this.value);

    if (res !== null) {
      this.isLoading = false;
      this.aiMessage = res['response'];
    }
  }

  async getOpenAIResponse(prompt: string) {
    this.isLoading = true;

    const model = new ChatOpenAI({
      streaming: true,
      openAIApiKey: environment.openAiKey,
      temperature: 0.7,
    });

    const chain = new ConversationChain({
      memory: this.memory,
      llm: model,
    });

    const result = await chain.call({ input: prompt });

    this.memory.chatHistory.addUserMessage(prompt);
    this.memory.chatHistory.addAIChatMessage(result['response']);

    return result;
  }

  handleClearChat() {
    this.value = '';
    this.aiMessage = null;
  }
}
