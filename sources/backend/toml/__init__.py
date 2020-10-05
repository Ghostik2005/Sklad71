"""Python module which parses and emits TOML.

Released under the MIT license.
"""

from . import encoder
from . import decoder

__version__ = "0.10.1"
_spec_ = "0.5.0"

load = decoder.load
loads = decoder.loads
TomlDecoder = decoder.TomlDecoder
TomlDecodeError = decoder.TomlDecodeError
TomlPreserveCommentDecoder = decoder.TomlPreserveCommentDecoder

dump = encoder.dump
dumps = encoder.dumps
TomlEncoder = encoder.TomlEncoder
TomlArraySeparatorEncoder = encoder.TomlArraySeparatorEncoder
TomlPreserveInlineDictEncoder = encoder.TomlPreserveInlineDictEncoder
TomlNumpyEncoder = encoder.TomlNumpyEncoder
TomlPreserveCommentEncoder = encoder.TomlPreserveCommentEncoder
TomlPathlibEncoder = encoder.TomlPathlibEncoder

from collections import OrderedDict

class TomlOrderedDecoder(TomlDecoder):

    def __init__(self):
        super(self.__class__, self).__init__(_dict=OrderedDict)


class TomlOrderedEncoder(TomlEncoder):

    def __init__(self):
        super(self.__class__, self).__init__(_dict=OrderedDict)

#print('TOML', __version__, flush=True)