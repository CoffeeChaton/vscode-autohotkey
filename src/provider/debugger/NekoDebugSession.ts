/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    BreakpointEvent,
    InitializedEvent,
    LoggingDebugSession,
    OutputEvent,
    StoppedEvent,
    TerminatedEvent,
    Thread,
} from '@vscode/debugadapter';
import { DebugProtocol } from '@vscode/debugprotocol';
import { basename } from 'path';
import { commands } from 'vscode';
import { getDebugPath } from '../../configUI';
import { getPathByActive } from '../Service/Service';
import { DebugDispather } from './debugDispather';
import { EContinue, EVscodeScope, TLaunchRequestArguments } from './DebugTypeEnum';

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
            .on('break', (reason: string): void => {
                this.sendEvent(new StoppedEvent(reason, Enum.THREAD_ID));
            })
            .on('breakpointValidated', (bp: DebugProtocol.Breakpoint) => {
                const breakpoint: DebugProtocol.Breakpoint = { verified: bp.verified, id: bp.id };
                this.sendEvent(new BreakpointEvent('changed', breakpoint));
            })
            .on('output', (text) => {
                const text2 = text as string;
                this.sendEvent(new OutputEvent(`${text2}\n`));
                commands.executeCommand('workbench.debug.action.focusRepl');
            })
            .on('end', (): void => {
                this.sendEvent(new TerminatedEvent());
            });
    }

    protected override initializeRequest(
        response: DebugProtocol.InitializeResponse,
        _args: DebugProtocol.InitializeRequestArguments,
    ): void {
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

    protected override restartRequest(
        response: DebugProtocol.RestartResponse,
        _args: DebugProtocol.RestartArguments,
        _request?: DebugProtocol.Request,
    ): void {
        this.dispather.restart();
        this.sendResponse(response);
    }

    protected override launchRequest(
        response: DebugProtocol.LaunchResponse,
        args: DebugProtocol.LaunchRequestArguments,
    ): void {
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

    protected override disconnectRequest(
        response: DebugProtocol.DisconnectResponse,
        _args: DebugProtocol.DisconnectArguments,
        _request?: DebugProtocol.Request,
    ): void {
        this.dispather.stop();
        this.sendResponse(response);
    }

    protected override setBreakPointsRequest(
        response: DebugProtocol.SetBreakpointsResponse,
        args: DebugProtocol.SetBreakpointsArguments,
    ): void {
        // const path = args?.source.path;
        const path: string | undefined = args?.source.path;
        if (!path) throw new Error('setBreakPointsRequest path error --48--33--44--');
        if (!basename(path).endsWith('.ahk')) throw new Error('just support .ahk file debug --48--33--61');
        const sourceBreakpoints: DebugProtocol.SourceBreakpoint[] | undefined = args.breakpoints;
        if (!sourceBreakpoints) throw new Error('setBreakPointsRequest sourceBreakpoints error--88--55--170-63');

        response.body = { breakpoints: this.dispather.buildBreakPoint(path, sourceBreakpoints) };
        this.sendResponse(response);
    }

    protected override async stackTraceRequest(
        response: DebugProtocol.StackTraceResponse,
        args: DebugProtocol.StackTraceArguments,
    ): Promise<void> {
        response.body = { stackFrames: await this.dispather.stack(args) };
        this.sendResponse(response);
    }

    protected override scopesRequest(
        response: DebugProtocol.ScopesResponse,
        args: DebugProtocol.ScopesArguments,
    ): void {
        const ID: number = args.frameId;
        response.body = { scopes: this.dispather.scopes(ID) };
        this.sendResponse(response);
    }

    protected override async variablesRequest(
        response: DebugProtocol.VariablesResponse,
        args: DebugProtocol.VariablesArguments,
        _request?: DebugProtocol.Request,
    ): Promise<void> {
        response.body = { variables: await this.dispather.listVariables(args) };
        this.sendResponse(response);
    }

    protected override async setVariableRequest(
        response: DebugProtocol.SetVariableResponse,
        args: DebugProtocol.SetVariableArguments,
        _request?: DebugProtocol.Request,
    ): Promise<void> {
        try {
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

    protected override pauseRequest(
        response: DebugProtocol.PauseResponse,
        _args: DebugProtocol.PauseArguments,
        _request?: DebugProtocol.Request,
    ): void {
        this.dispather.sendComand(EContinue.BREAK);
        this.sendResponse(response);
    }

    protected override continueRequest(
        response: DebugProtocol.ContinueResponse,
        _args: DebugProtocol.ContinueArguments,
    ): void {
        this.dispather.sendComand(EContinue.RUN);
        this.sendResponse(response);
    }

    protected override nextRequest(response: DebugProtocol.NextResponse, _args: DebugProtocol.NextArguments): void {
        this.dispather.sendComand(EContinue.STEP_OVER);
        this.sendResponse(response);
    }

    protected override stepInRequest(
        response: DebugProtocol.StepInResponse,
        _args: DebugProtocol.StepInArguments,
        _request?: DebugProtocol.Request,
    ): void {
        this.dispather.sendComand(EContinue.STEP_INTO);
        this.sendResponse(response);
    }

    protected override stepOutRequest(
        response: DebugProtocol.StepOutResponse,
        _args: DebugProtocol.StepOutArguments,
        _request?: DebugProtocol.Request,
    ): void {
        this.dispather.sendComand(EContinue.STEP_OUT);
        this.sendResponse(response);
    }

    protected override threadsRequest(response: DebugProtocol.ThreadsResponse): void {
        response.body = { threads: [new Thread(Enum.THREAD_ID, 'main thread')] };
        this.sendResponse(response);
    }

    protected override async completionsRequest(
        response: DebugProtocol.CompletionsResponse,
        _args: DebugProtocol.CompletionsArguments,
    ): Promise<void> {
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

    protected override async evaluateRequest(
        response: DebugProtocol.EvaluateResponse,
        args: DebugProtocol.EvaluateArguments,
    ): Promise<void> {
        const str: string = args.expression;
        const exp = str.split('=');
        if (exp.length !== 1) {
            this.dispather.setVariable({ name: exp[0], value: exp[1], variablesReference: EVscodeScope.LOCAL });
        }

        const result: string = exp.length === 1
            ? await this.dispather.getVariableByEval(args)
            : `execute: ${str}`;

        response.body = {
            result: result || 'null--191',
            variablesReference: 0,
        };
        this.sendResponse(response);
    }
}
