declare module "graphql-relay" {



    import {
        GraphQLBoolean,
        GraphQLInt,
        GraphQLNonNull,
        GraphQLList,
        GraphQLObjectType,
        GraphQLString,
        GraphQLFieldConfig,
        GraphQLInputFieldConfigMap,
        GraphQLFieldConfigMap,
        GraphQLFieldConfigArgumentMap,
        GraphQLResolveInfo,
        GraphQLInterfaceType,
        GraphQLInputType,
        GraphQLOutputType,
        GraphQLFieldResolver,
        GraphQLTypeResolver,
        Thunk
    } from "graphql";

// connection/connection.js

    /**
     * Returns a GraphQLFieldConfigArgumentMap appropriate to include on a field
     * whose return type is a connection type with forward pagination.
     */
    export const forwardConnectionArgs: GraphQLFieldConfigArgumentMap;

    /**
     * Returns a GraphQLFieldConfigArgumentMap appropriate to include on a field
     * whose return type is a connection type with backward pagination.
     */
    export const backwardConnectionArgs: GraphQLFieldConfigArgumentMap;

    /**
     * Returns a GraphQLFieldConfigArgumentMap appropriate to include on a field
     * whose return type is a connection type with bidirectional pagination.
     */
    export const  connectionArgs: GraphQLFieldConfigArgumentMap;

    type ConnectionConfig = {
        name?: string | null,
        nodeType: GraphQLObjectType,
        resolveNode?: GraphQLFieldResolver<any, any> | null,
        resolveCursor?: GraphQLFieldResolver<any, any> | null,
        edgeFields?: Thunk<GraphQLFieldConfigMap<any, any>> | null,
        connectionFields?: Thunk<GraphQLFieldConfigMap<any, any>> | null
    };

    type GraphQLConnectionDefinitions = {
        edgeType: GraphQLObjectType,
        connectionType: GraphQLObjectType
    };

    /**
     * Returns a GraphQLObjectType for a connection with the given name,
     * and whose nodes are of the specified type.
     */
    export function connectionDefinitions(
        config: ConnectionConfig
    ): GraphQLConnectionDefinitions;

// connection/connectiontypes.js

    /**
     * An flow type alias for cursors in this implementation.
     */
    export type ConnectionCursor = string;

    /**
     * A flow type designed to be exposed as `PageInfo` over GraphQL.
     */
    export type PageInfo = {
        startCursor: ConnectionCursor,
        endCursor: ConnectionCursor,
        hasPreviousPage: boolean,
        hasNextPage: boolean
    };

    /**
     * A flow type designed to be exposed as a `Connection` over GraphQL.
     */
    export type Connection<T> = {
        edges: Array<Edge<T>>;
        pageInfo: PageInfo;
    };

    /**
     * A flow type designed to be exposed as a `Edge` over GraphQL.
     */
    type Edge<T> = {
        node: T;
        cursor: ConnectionCursor;
    };

    /**
     * A flow type describing the arguments a connection field receives in GraphQL.
     */
    type ConnectionArguments = {
        before?: ConnectionCursor;
        after?: ConnectionCursor;
        first?: number;
        last?: number;
    };


// connection/arrayconnection.js

    type ArraySliceMetaInfo = {
        sliceStart: number;
        arrayLength: number;
    };

    /**
     * A simple function that accepts an array and connection arguments, and returns
     * a connection object for use in GraphQL. It uses array offsets as pagination,
     * so pagination will only work if the array is static.
     */
    export function connectionFromArray<T>(
        data: Array<T>,
        args: ConnectionArguments
    ): Connection<T>;

    /**
     * A version of `connectionFromArray` that takes a promised array, and returns a
     * promised connection.
     */
    export function connectionFromPromisedArray<T>(
        dataPromise: Promise<Array<T>>,
        args: ConnectionArguments
    ): Promise<Connection<T>>;

    /**
     * Given a slice (subset) of an array, returns a connection object for use in
     * GraphQL.
     *
    * This function is similar to `connectionFromArray`, but is intended for use
    * cases where you know the cardinality of the connection, consider it too large
    * to materialize the entire array, and instead wish pass in a slice of the
    * total result large enough to cover the range specified in `args`.
    */
    export function connectionFromArraySlice<T>(
        arraySlice: Array<T>,
        args: ConnectionArguments,
        meta: ArraySliceMetaInfo
    ): Connection<T>;

    /**
     * A version of `connectionFromArraySlice` that takes a promised array slice,
     * and returns a promised connection.
     */
    export function connectionFromPromisedArraySlice<T>(
        dataPromise: Promise<Array<T>>,
        args: ConnectionArguments,
        arrayInfo: ArraySliceMetaInfo
    ): Promise<Connection<T>>;

    /**
     * Creates the cursor string from an offset.
     */
    export function offsetToCursor(offset: number): ConnectionCursor;

    /**
     * Rederives the offset from the cursor string.
     */
    export function cursorToOffset(cursor: ConnectionCursor): number;

    /**
     * Return the cursor associated with an object in an array.
     */
    export function cursorForObjectInConnection<T>(
        data: Array<T>,
        object: T
    ): ConnectionCursor;

    /**
     * Given an optional cursor and a default offset, returns the offset
     * to use; if the cursor contains a valid offset, that will be used,
     * otherwise it will be the default.
     */
    export function getOffsetWithDefault(
        cursor?: ConnectionCursor,
        defaultOffset?: number
    ): number;

// mutation/mutation.js

    type mutationFn = (
        object: any,
        ctx: any,
        info: GraphQLResolveInfo
    ) => Promise<any> | any;

    /**
     * A description of a mutation consumable by mutationWithClientMutationId
     * to create a GraphQLFieldConfig for that mutation.
     *
     * The inputFields and outputFields should not include `clientMutationId`,
     * as this will be provided automatically.
     *
     * An input object will be created containing the input fields, and an
     * object will be created containing the output fields.
     *
     * mutateAndGetPayload will receieve an Object with a key for each
     * input field, and it should return an Object with a key for each
     * output field. It may return synchronously, or return a Promise.
     */
    type MutationConfig = {
        name: string,
        description?: string
        inputFields: Thunk<GraphQLInputFieldConfigMap>,
        outputFields: Thunk<GraphQLFieldConfigMap<any, any>>,
        mutateAndGetPayload: mutationFn,
    };

    /**
     * Returns a GraphQLFieldConfig for the mutation described by the
     * provided MutationConfig.
     */
    export function mutationWithClientMutationId(
        config: MutationConfig
    ): GraphQLFieldConfig<any, any>;

// node/node.js

    type GraphQLNodeDefinitions = {
        nodeInterface: GraphQLInterfaceType,
        nodeField: GraphQLFieldConfig<any, any>
    };

    type typeResolverFn = ((any) => GraphQLObjectType) |
        ((any) => Promise<GraphQLObjectType>);

    /**
     * Given a function to map from an ID to an underlying object, and a function
     * to map from an underlying object to the concrete GraphQLObjectType it
     * corresponds to, constructs a `Node` interface that objects can implement,
     * and a field config for a `node` root field.
     *
     * If the typeResolver is omitted, object resolution on the interface will be
     * handled with the `isTypeOf` method on object types, as with any GraphQL
     * interface without a provided `resolveType` method.
     */
    export function nodeDefinitions<TContext>(
        idFetcher: ((id: string, context: TContext, info: GraphQLResolveInfo) => any),
        typeResolver?: GraphQLTypeResolver<any, TContext>
    ): GraphQLNodeDefinitions;

    type ResolvedGlobalId = {
        type: string,
        id: string
    };

    /**
     * Takes a type name and an ID specific to that type name, and returns a
     * "global ID" that is unique among all types.
     */
    export function toGlobalId(type: string, id: string): string;

    /**
     * Takes the "global ID" created by toGlobalID, and returns the type name and ID
     * used to create it.
     */
    export function fromGlobalId(globalId: string): ResolvedGlobalId;

    /**
     * Creates the configuration for an id field on a node, using `toGlobalId` to
     * construct the ID from the provided typename. The type-specific ID is fetched
     * by calling idFetcher on the object, or if not provided, by accessing the `id`
     * property on the object.
     */
    export function globalIdField(
        typeName?: string,
        idFetcher?: (object: any, context:any, info: GraphQLResolveInfo) => string
    ): GraphQLFieldConfig<any, any>;


// node/plural.js

    type PluralIdentifyingRootFieldConfig = {
        argName: string,
        inputType: GraphQLInputType,
        outputType: GraphQLOutputType,
        resolveSingleInput: (input: any, context:any, info: GraphQLResolveInfo) => any,
        description?: string,
    };

    export function pluralIdentifyingRootField(
        config: PluralIdentifyingRootFieldConfig
    ): GraphQLFieldConfig<any, any>;
}
