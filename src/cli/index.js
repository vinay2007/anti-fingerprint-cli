#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const figlet = require('figlet');
const boxen = require('boxen');
const path = require('path');
const fs = require('fs-extra');
const { launchBrowser, USER_DATA_DIR } = require('../browser/launcher');
const logger = require('../utils/logger');

const program = new Command();

program
  .name('anti-fingerprint')
  .description('Browser privacy protection tool')
  .version('1.0.0');

const displayBanner = () => {
  console.log(
    chalk.cyan(
      figlet.textSync('Anti-Fingerprint', { horizontalLayout: 'full' })
    )
  );
  console.log(
    boxen(chalk.white('Privacy Protection Active'), {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'cyan',
    })
  );
};

const PID_FILE = path.join(require('os').homedir(), '.anti-fingerprint', 'browser.pid');

const startAction = async (options) => {
  if (fs.existsSync(PID_FILE)) {
    const pid = fs.readFileSync(PID_FILE, 'utf8');
    try {
      process.kill(pid, 0);
      logger.warn(`Browser is already running (PID: ${pid}).`);
      return;
    } catch (e) {
      fs.removeSync(PID_FILE);
    }
  }

  displayBanner();
  
  if (options.detached) {
    const { spawn } = require('child_process');
    const out = fs.openSync(path.join(require('os').homedir(), '.anti-fingerprint', 'out.log'), 'a');
    const err = fs.openSync(path.join(require('os').homedir(), '.anti-fingerprint', 'err.log'), 'a');

    const child = spawn(process.argv[0], [process.argv[1], '--no-detached-loop'], {
      detached: true,
      stdio: ['ignore', out, err]
    });
    
    fs.writeFileSync(PID_FILE, child.pid.toString());
    child.unref();
    logger.success(`Browser started in background (PID: ${child.pid})`);
    process.exit(0);
  }

  const spinner = ora('Launching protected browser...').start();
  try {
    const context = await launchBrowser();
    fs.writeFileSync(PID_FILE, process.pid.toString());
    
    spinner.succeed('Browser launched with protection.');
    logger.success('Extension loaded: Anti-Fingerprint Protection');
    logger.info(`Using isolated profile: ${USER_DATA_DIR}`);
    logger.info('Press Ctrl+C to stop protection and close browser.');

    const page = await context.newPage();
    await page.goto('about:blank');
    await page.evaluate(() => {
      document.body.style.backgroundColor = '#0a0a0a';
      document.body.style.color = 'white';
      document.body.style.fontFamily = 'sans-serif';
      document.body.style.display = 'flex';
      document.body.style.justifyContent = 'center';
      document.body.style.alignItems = 'center';
      document.body.style.height = '100vh';
      document.body.style.margin = '0';
      document.body.innerHTML = '<div><h1>Anti-Fingerprint Protection Active</h1><p style="text-align:center">Your privacy is now protected. Browse normally.</p></div>';
    });
    process.on('SIGINT', async () => {
      logger.info('Stopping protection...');
      await context.close();
      if (fs.existsSync(PID_FILE)) fs.removeSync(PID_FILE);
      process.exit(0);
    });

    context.on('close', () => {
      if (fs.existsSync(PID_FILE)) fs.removeSync(PID_FILE);
      process.exit(0);
    });

  } catch (err) {
    spinner.fail('Failed to launch browser');
    logger.error(err.message);
    if (fs.existsSync(PID_FILE)) fs.removeSync(PID_FILE);
    process.exit(1);
  }
};

// Subcommands
program
  .command('start')
  .description('Start the protected browser')
  .option('-d, --detached', 'Run in background')
  .action(async (options) => {
    await startAction(options);
  });

program
  .command('stop')
  .description('Stop the protected browser')
  .action(async () => {
    if (!fs.existsSync(PID_FILE)) {
      logger.warn('No running browser found.');
      return;
    }
    const pid = fs.readFileSync(PID_FILE, 'utf8');
    try {
      process.kill(pid, 'SIGINT');
      logger.success(`Stopped browser protection (PID: ${pid}).`);
    } catch (e) {
      logger.error(`Failed to stop browser: ${e.message}`);
    }
    fs.removeSync(PID_FILE);
  });

program
  .command('status')
  .description('Check protection status')
  .action(() => {
    const isProfileExists = fs.existsSync(USER_DATA_DIR);
    if (isProfileExists) {
      logger.success('Status: Protection system ready.');
    } else {
      logger.warn('Status: Protection not yet initialized. Run "anti-fingerprint".');
    }
  });

program
  .command('test')
  .description('Run fingerprint tests')
  .action(async () => {
    logger.info('Opening fingerprint testing websites...');
    const context = await launchBrowser();
    const page = await context.newPage();
    
    const testSites = [
      'https://browserleaks.com/canvas',
      'https://browserleaks.com/webgl',
      'https://amiunique.org/fp',
      'https://coveryourtracks.eff.org/'
    ];

    for (const site of testSites) {
      const p = await context.newPage();
      await p.goto(site);
    }
    
    logger.success('Test pages opened. Verify the results in the browser.');
  });

program
  .command('uninstall')
  .description('Uninstall the tool and remove all data')
  .action(async () => {
    const isWindows = process.platform === 'win32';
    const spinner = ora('Uninstalling...').start();
    try {
      // 1. Remove local config/profile data
      const configDir = path.join(require('os').homedir(), '.anti-fingerprint');
      if (fs.existsSync(configDir)) {
        await fs.remove(configDir);
      }
      
      // 2. Remove installation directory if it exists
      const installDir = path.join(require('os').homedir(), '.anti-fingerprint-cli');
      if (fs.existsSync(installDir)) {
        // Note: On Windows, we can't easily remove the directory we are currently running from
        // but we can try or give instructions.
        try {
          await fs.remove(installDir);
        } catch (e) {
          // Ignore error if directory is in use
        }
      }

      spinner.succeed('Successfully removed local configurations and browser data.');
      
      console.log('\n' + boxen(chalk.yellow('Final Steps Required'), { padding: 1, borderStyle: 'round' }));
      
      if (isWindows) {
        logger.info('To fully remove the global command, run:');
        console.log(chalk.cyan('  npm uninstall -g anti-fingerprint'));
      } else {
        logger.info('To fully remove the global command, run:');
        console.log(chalk.cyan('  sudo rm /usr/local/bin/anti-fingerprint'));
        console.log(chalk.cyan(`  rm -rf ${installDir}`));
      }
      
    } catch (err) {
      spinner.fail('Uninstallation failed');
      logger.error(err.message);
    }
  });

// Root action for "anti-fingerprint" without subcommand
program
  .option('-d, --detached', 'Run in background')
  .option('--no-detached-loop', 'Internal use only')
  .action(async (options) => {
    // Check if any subcommand was provided. If not, run startAction.
    if (program.args.length === 0) {
      await startAction(options);
    }
  });

program.parse(process.argv);
