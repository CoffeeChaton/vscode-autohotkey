/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable immutable/no-mutation */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable immutable/no-this */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import { commands } from 'vscode';
import {
    BreakpointEvent, InitializedEvent, LoggingDebugSession, OutputEvent, StoppedEvent, TerminatedEvent, Thread,
} from 'vscode-debugadapter';
import { DebugProtocol } from 'vscode-debugprotocol';
import { basename } from 'path';
import { EContinue, EVscodeScope, TLaunchRequestArguments } from './DebugTypeEnum';
import { DebugDispather } from './debugDispather';
import { getDebugPath } from '../../configUI';
import { getPathByActive } from '../Service/Service';

const enum Enum {
    THREAD_ID = 1,
}

export class NekoDebugSession extends LoggingDebugSession {
    //  private static THREAD_ID = 1;

    private dispather: DebugDispather = new DebugDispather();

    public constructor() {
        super('neko-debug.txt');

        this.setDebuggerLinesStartAt1(false);
        this.setDebuggerColumnsStartAt1(false);

        this.dispather
            .on('break', (reason: string) => this.sendEvent(new StoppedEvent(reason, Enum.THREAD_ID)))
            .on('breakpointValidated', (bp: DebugProtocol.Breakpoint) => {
                const breakpoint: DebugProtocol.Breakpoint = { verified: bp.verified, id: bp.id };
                this.sendEvent(new BreakpointEvent('changed', breakpoint));
            })
            .on('output', (text) => {
                const text2 = text as string;
                this.sendEvent(new OutputEvent(`${text2}\n`));
                commands.executeCommand('workbench.debug.action.focusRepl');
            })
            .on('end', () => this.sendEvent(new TerminatedEvent()));
    }

    protected initializeRequest(response: DebugProtocol.InitializeResponse, args: DebugProtocol.InitializeRequestArguments): void {
        response.body = {
            ...response.body,
            completionTriggerCharacters: ['.', '['],
            supportsConfigurationDoneRequest: false,
            supportsEvaluateForHovers: true,
            supportsStepBack: false,
            supportsDataBreakpoints: false,
            supportsCompletionsRequest: true,
            supportsCancelRequest: true,
            supportsRestartRequest: true,
            supportsBreakpointLocationsRequest: false,
            supportsSetVariable: true,
        };

        this.sendResponse(response);
        this.sendEvent(new InitializedEvent());
    }

    protected restartRequest(response: DebugProtocol.RestartResponse, args: DebugProtocol.RestartArguments, request?: DebugProtocol.Request): void {
        this.dispather.restart();
        this.sendResponse(response);
    }

    protected launchRequest(response: DebugProtocol.LaunchResponse, args: DebugProtocol.LaunchRequestArguments): void {
        const ab: TLaunchRequestArguments = {
            name: 'Autohotkey Debugger',
            program: getPathByActive(),
            request: undefined, // ?
            runtime: getDebugPath(),
            noDebug: undefined,
            __restart: undefined,
            type: 'ahk',
            dbgpSettings: {
                max_children: 300,
                max_data: 131072,
            },
            stopOnEntry: true,
            __configurationTarget: 0,
            __sessionId: 'TLaunchRequestArguments--Err--174--55--66',
        };
        const argsF: TLaunchRequestArguments = { ...ab, ...args };
        this.dispather.start(argsF);
        this.sendResponse(response);
    }

    protected disconnectRequest(response: DebugProtocol.DisconnectResponse, args: DebugProtocol.DisconnectArguments, request?: DebugProtocol.Request): void {
        this.dispather.stop();
        this.sendResponse(response);
    }

    protected setBreakPointsRequest(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments): void {
        const path = args?.source.path || null;

        if (!path) throw new Error('setBreakPointsRequest path error --48--33--44--');
        if (!basename(path).endsWith('.ahk')) throw new Error('just support .ahk file debug --48--33--61');
        const sourceBreakpoints = args.breakpoints;
        if (!sourceBreakpoints) throw new Error('setBreakPointsRequest sourceBreakpoints error--88--55--170-63');

        response.body = { breakpoints: this.dispather.buildBreakPoint(path, sourceBreakpoints) };
        this.sendResponse(response);
    }

    protected async stackTraceRequest(response: DebugProtocol.StackTraceResponse, args: DebugProtocol.StackTraceArguments): Promise<void> {
        response.body = { stackFrames: await this.dispather.stack(args) };
        this.sendResponse(response);
    }

    protected scopesRequest(response: DebugProtocol.ScopesResponse, args: DebugProtocol.ScopesArguments): void {
        response.body = { scopes: this.dispather.scopes(args.frameId) };
        this.sendResponse(response);
    }

    protected async variablesRequest(response: DebugProtocol.VariablesResponse, args: DebugProtocol.VariablesArguments, request?: DebugProtocol.Request): Promise<void> {
        response.body = { variables: await this.dispather.listVariables(args) };
        this.sendResponse(response);
    }

    protected async setVariableRequest(response: DebugProtocol.SetVariableResponse, args: DebugProtocol.SetVariableArguments, request?: DebugProtocol.Request): Promise<void> {
        try {
            console.log('NekoDebugSession ~ setVariableRequest ~ args', args);
            response.body = await this.dispather.setVariable(args);
            this.sendResponse(response);
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
                const format = error.message;
                this.sendErrorResponse(response, {
                    id: args.variablesReference,
                    format,
                });
            } else {
                console.error('🚀 ~err85~ NekoDebugSession ~ setVariableRequest ~ error', error);
                throw new Error(error as string && '--140--120--setVariableRequest');
            }
        }
    }

    protected pauseRequest(response: DebugProtocol.PauseResponse, args: DebugProtocol.PauseArguments, request?: DebugProtocol.Request): void {
        this.dispather.sendComand(EContinue.BREAK);
        this.sendResponse(response);
    }

    protected continueRequest(response: DebugProtocol.ContinueResponse, args: DebugProtocol.ContinueArguments): void {
        this.dispather.sendComand(EContinue.RUN);
        this.sendResponse(response);
    }

    protected nextRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments): void {
        this.dispather.sendComand(EContinue.STEP_OVER);
        this.sendResponse(response);
    }

    protected stepInRequest(response: DebugProtocol.StepInResponse, args: DebugProtocol.StepInArguments, request?: DebugProtocol.Request): void {
        this.dispather.sendComand(EContinue.STEP_INTO);
        this.sendResponse(response);
    }

    protected stepOutRequest(response: DebugProtocol.StepOutResponse, args: DebugProtocol.StepOutArguments, request?: DebugProtocol.Request): void {
        this.dispather.sendComand(EContinue.STEP_OUT);
        this.sendResponse(response);
    }

    protected threadsRequest(response: DebugProtocol.ThreadsResponse): void {
        response.body = { threads: [new Thread(Enum.THREAD_ID, 'main thread')] };
        this.sendResponse(response);
    }

    protected async completionsRequest(response: DebugProtocol.CompletionsResponse, args: DebugProtocol.CompletionsArguments): Promise<void> {
        response.body = {
            targets: [
                ...(await this.dispather.listVariables({ variablesReference: EVscodeScope.LOCAL })),
                ...(await this.dispather.listVariables({ variablesReference: EVscodeScope.GLOBAL })),
            ]
                .map((variable) => ({
                    type: 'variable',
                    label: variable.name,
                    sortText: variable.name,
                })),
        };
        this.sendResponse(response);
    }

    protected async evaluateRequest(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments): Promise<void> {
        const exp = args.expression.split('=');
        if (exp.length !== 1) {
            console.log('NekoDebugSession ~ evaluateRequest ~ response', response);
            this.dispather.setVariable({ name: exp[0], value: exp[1], variablesReference: EVscodeScope.LOCAL });
        }

        const result: string = exp.length === 1
            ? await this.dispather.getVariableByEval(args)
            : `execute: ${args.expression}`;

        response.body = {
            result: result || 'null--191',
            variablesReference: 0,
        };
        this.sendResponse(response);
    }
}
