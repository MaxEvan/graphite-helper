import { spawnSync } from 'node:child_process';
// import { prompt } from 'prompts';
import prompt from 'prompts';

const graphitePath = '/opt/homebrew/bin/gt';

async function main() {
  const choices = [
    {
      title: 'checkout (switch branch)',
      value: 'checkout',
    },
    { title: 'create (new stack with commit message)', value: 'create' },
    {
      title: 'log (see the state of your repo)',
      value: 'log',
    },
    {
      title: 'pop (delete active branch but keep changes)',
      value: 'pop',
    },
    { title: 'submit (push branch to graphite)', value: 'submit' },
    { title: 'sync (rebase with remote origin)', value: 'sync' },
  ];

  const { command } = (await prompt([
    {
      type: 'autocomplete',
      name: 'command',
      message: 'What graphite command would you like to run?',
      choices: choices.map((choice, index) => ({
        title: `${index + 1}. ${choice.title}`,
        value: choice.value,
      })),
    },
  ])) as { command: GraphiteCommand };

  commands[command]();
}

const runGraphiteCommand = (args: string[]) => {
  spawnSync(graphitePath, [...args], { stdio: 'inherit' });
};

const create = async () => {
  const { message } = (await prompt([
    { type: 'text', name: 'message', message: 'Commit message' },
  ])) as { message: string };

  runGraphiteCommand(['create', '-m', message]);
};

const log = async () => {
  runGraphiteCommand(['log']);
};

const sync = async () => {
  runGraphiteCommand(['sync']);
};

const checkout = async () => {
  runGraphiteCommand(['checkout']);
};

const pop = async () => {
  runGraphiteCommand(['pop']);
};

const submit = async () => {
  runGraphiteCommand(['submit']);
};

const commands = {
  checkout,
  create,
  log,
  pop,
  submit,
  sync,
} as const;

type GraphiteCommand = keyof typeof commands;

main();
