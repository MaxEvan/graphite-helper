import { spawnSync } from 'node:child_process';
// import { prompt } from 'prompts';
import prompt from 'prompts';

const graphitePath = '/opt/homebrew/bin/gt';

async function main() {
  const { command } = (await prompt([
    {
      type: 'autocomplete',
      name: 'command',
      message: 'What graphite command would you like to run?',
      choices: [
        { title: '1. create (new stack with commit message)', value: 'create' },
        { title: '2. sync (rebase with remote origin)', value: 'sync' },
        {
          title: '3. checkout (switch branch)',
          value: 'checkout',
        },
        {
          title: '4. pop (delete active branch but keep changes)',
          value: 'pop',
        },
        {
          title: '5. log (see the state of your repo)',
          value: 'log',
        },
      ],
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

const commands = {
  create,
  sync,
  checkout,
  pop,
  log,
} as const;

type GraphiteCommand = keyof typeof commands;

main();
