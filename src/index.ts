import { spawnSync } from 'node:child_process';
import prompt from 'prompts';

const graphitePath = '/opt/homebrew/bin/gt';

const choices = [
  { title: 'c: create (new stack with commit message)', value: 'create' },
  {
    title: 'l: log (see the state of your repo)',
    value: 'log',
  },
  { title: 'm: modify (add changes to active branch)', value: 'modify' },
  {
    title: 'o: checkout (switch branch)',
    value: 'checkout',
  },

  {
    title: 'p: pop (delete active branch but keep changes)',
    value: 'pop',
  },
  { title: 's: sync (rebase with remote origin)', value: 'sync' },
  { title: 'u: submit (push branch to graphite)', value: 'submit' },
];

async function main() {
  const { command } = (await prompt([
    {
      type: 'autocomplete',
      name: 'command',
      message: 'What graphite command would you like to run?',
      choices: choices.map((choice, index) => ({
        title: choice.title,
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

const modify = async () => {
  runGraphiteCommand(['modify']);
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
  modify,
  pop,
  submit,
  sync,
} as const;

type GraphiteCommand = keyof typeof commands;

main();
