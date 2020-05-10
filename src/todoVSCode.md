
/**
 * Creates a file system watcher.
 *
 * A glob pattern that filters the file events on their absolute path must be provided. Optionally,
 * flags to ignore certain kinds of events can be provided. To stop listening to events the watcher must be disposed.
 *
 * *Note* that only files within the current [workspace folders](#workspace.workspaceFolders) can be watched.
 *
 * @param globPattern A [glob pattern](#GlobPattern) that is applied to the absolute paths of created, changed,
 * and deleted files. Use a [relative pattern](#RelativePattern) to limit events to a certain [workspace folder](#WorkspaceFolder).
 * @param ignoreCreateEvents Ignore when files have been created.
 * @param ignoreChangeEvents Ignore when files have been changed.
 * @param ignoreDeleteEvents Ignore when files have been deleted.
 * @return A new file system watcher instance.
 */
export function createFileSystemWatcher(globPattern: GlobPattern, ignoreCreateEvents?: boolean, ignoreChangeEvents?: boolean, ignoreDeleteEvents?: boolean): FileSystemWatcher;


/**
 * Find files across all [workspace folders](#workspace.workspaceFolders) in the workspace.
 *
 * @sample `findFiles('**​/*.js', '**​/node_modules/**', 10)`
 * @param include A [glob pattern](#GlobPattern) that defines the files to search for. The glob pattern
 * will be matched against the file paths of resulting matches relative to their workspace. Use a [relative pattern](#RelativePattern)
 * to restrict the search results to a [workspace folder](#WorkspaceFolder).
 * @param exclude  A [glob pattern](#GlobPattern) that defines files and folders to exclude. The glob pattern
 * will be matched against the file paths of resulting matches relative to their workspace. When `undefined` only default excludes will
 * apply, when `null` no excludes will apply.
 * @param maxResults An upper-bound for the result.
 * @param token A token that can be used to signal cancellation to the underlying search engine.
 * @return A thenable that resolves to an array of resource identifiers. Will return no results if no
 * [workspace folders](#workspace.workspaceFolders) are opened.
 */
export function findFiles(include: GlobPattern, exclude?: GlobPattern | null, maxResults?: number, token?: CancellationToken): Thenable<Uri[]>;

/**
* Opens a document. Will return early if this document is already open. Otherwise
* the document is loaded and the [didOpen](#workspace.onDidOpenTextDocument)-event fires.
*
* The document is denoted by an [uri](#Uri). Depending on the [scheme](#Uri.scheme) the
* following rules apply:
* * `file`-scheme: Open a file on disk, will be rejected if the file does not exist or cannot be loaded.
* * `untitled`-scheme: A new file that should be saved on disk, e.g. `untitled:c:\frodo\new.js`. The language
* will be derived from the file name.
* * For all other schemes contributed [text document content providers](#TextDocumentContentProvider) and
* [file system providers](#FileSystemProvider) are consulted.
*
* *Note* that the lifecycle of the returned document is owned by the editor and not by the extension. That means an
* [`onDidClose`](#workspace.onDidCloseTextDocument)-event can occur at any time after opening it.
*
* @param uri Identifies the resource to open.
* @return A promise that resolves to a [document](#TextDocument).
*/
export function openTextDocument(uri: Uri): Thenable<TextDocument>;

/*
* Opens a document. Will return early if this document is already open. Otherwise
* the document is loaded and the [didOpen](#workspace.onDidOpenTextDocument)-event fires.
*

*/
export const onWillDeleteFiles: Event<FileWillDeleteEvent>;

/**
 * An event that is emitted when files have been deleted.
 *
 * *Note 1:* This event is triggered by user gestures, like deleting a file from the
 * explorer, or from the [`workspace.applyEdit`](#workspace.applyEdit)-api, but this event is *not* fired when
 * files change on disk, e.g triggered by another application, or when using the
 * [`workspace.fs`](#FileSystem)-api.
 *
 * *Note 2:* When deleting a folder with children only one event is fired.
 */
export const onDidDeleteFiles: Event<FileDeleteEvent>;

/**
 * An event that is emitted when files are being renamed.
 *
 * *Note 1:* This event is triggered by user gestures, like renaming a file from the
 * explorer, and from the [`workspace.applyEdit`](#workspace.applyEdit)-api, but this event is *not* fired when
 * files change on disk, e.g triggered by another application, or when using the
 * [`workspace.fs`](#FileSystem)-api.
 *
 * *Note 2:* When renaming a folder with children only one event is fired.
 */
export const onWillRenameFiles: Event<FileWillRenameEvent>;

/**
 * An event that is emitted when files have been renamed.
 *
 * *Note 1:* This event is triggered by user gestures, like renaming a file from the
 * explorer, and from the [`workspace.applyEdit`](#workspace.applyEdit)-api, but this event is *not* fired when
 * files change on disk, e.g triggered by another application, or when using the
 * [`workspace.fs`](#FileSystem)-api.
 *
 * *Note 2:* When renaming a folder with children only one event is fired.
 */
export const onDidRenameFiles: Event<FileRenameEvent>;
