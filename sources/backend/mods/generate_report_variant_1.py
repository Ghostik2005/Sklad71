# coding: utf-8

import os
import sys
import time
import zipfile
import datetime



from xml.dom.minidom import parseString
from xml.sax.saxutils import escape
import jam.common as common
from jam.dataset import *
from jam.sql import *
from jam.third_party.six import exec_, print_
from werkzeug._compat import iteritems, iterkeys, text_type, string_types, to_bytes, to_unicode



from items import *

class Report(AbstrReport):
    def __init__(self, task, owner, name='', caption='', visible = True,
            table_name='', view_template='', js_filename=''):
        AbstrReport.__init__(self, task, owner, name, caption, visible, js_filename=js_filename)
        self.param_defs = []
        self.params = []
        self.template = view_template
        self.template_name = None
        self.template_content = {}
        self.ext = 'ods'

        self.on_before_generate = None
        self.on_generate = None
        self.on_after_generate = None
        self.on_parsed = None
        self.on_before_save_report = None

        self.on_before_append = None
        self.on_after_append = None
        self.on_before_edit = None
        self.on_after_edit = None
        self.on_before_open = None
        self.on_after_open = None
        self.on_before_post = None
        self.on_after_post = None
        self.on_before_delete = None
        self.on_after_delete = None
        self.on_before_cancel = None
        self.on_after_cancel = None
        self.on_before_apply = None
        self.on_after_apply = None
        self.on_before_scroll = None
        self.on_after_scroll = None
        self.on_filter_record = None
        self.on_field_changed = None
        self.on_filters_applied = None
        self.on_before_field_changed = None
        self.on_filter_value_changed = None
        self.on_field_validate = None
        self.on_field_get_text = None


    def add_param(self, caption='', name='', data_type=common.INTEGER,
            obj=None, obj_field=None, required=True, visible=True, alignment=None,
            multi_select=None, multi_select_all=None, enable_typeahead=None, lookup_values=None,
            param_help=None, param_placeholder=None):
        param_def = self.add_param_def(caption, name, data_type, obj,
            obj_field, required, visible, alignment, multi_select, multi_select_all,
            enable_typeahead, lookup_values, param_help, param_placeholder)
        param = Param(self, param_def)
        self.params.append(param)

    def add_param_def(self, param_caption='', param_name='', data_type=common.INTEGER,
            lookup_item=None, lookup_field=None, required=True, visible=True,
            alignment=0, multi_select=False, multi_select_all=False, enable_typeahead=False,
            lookup_values=None, param_help=None,
        param_placeholder=None):
        param_def = [None for i in range(len(FIELD_DEF))]
        param_def[FIELD_NAME] = param_name
        param_def[NAME] = param_caption
        param_def[FIELD_DATA_TYPE] = data_type
        param_def[REQUIRED] = required
        param_def[LOOKUP_ITEM] = lookup_item
        param_def[LOOKUP_FIELD] = lookup_field
        param_def[FIELD_EDIT_VISIBLE] = visible
        param_def[FIELD_ALIGNMENT] = alignment
        param_def[FIELD_MULTI_SELECT] = multi_select
        param_def[FIELD_MULTI_SELECT_ALL] = multi_select_all
        param_def[FIELD_ENABLE_TYPEAHEAD] = enable_typeahead
        param_def[FIELD_LOOKUP_VALUES] = lookup_values
        param_def[FIELD_HELP] = param_help
        param_def[FIELD_PLACEHOLDER] = param_placeholder
        self.param_defs.append(param_def)
        return param_def

    def prepare_params(self):
        for param in self.params:
            if param.lookup_item and type(param.lookup_item) == int:
                param.lookup_item = self.task.item_by_ID(param.lookup_item)
            if param.lookup_field and type(param.lookup_field) == int:
                param.lookup_field = param.lookup_item._field_by_ID(param.lookup_field).field_name
            if param.lookup_values and type(param.lookup_values) == int:
                try:
                    param.lookup_values = self.task.lookup_lists[param.lookup_values]
                except:
                    pass


    def copy(self):
        result = self.__class__(self.task, None, self.item_name, self.item_caption, self.visible,
            '', self.template, '');
        result.on_before_generate = self.on_before_generate
        result.on_generate = self.on_generate
        result.on_after_generate = self.on_after_generate
        result.on_before_save_report = self.on_before_save_report
        result.on_parsed = self.on_parsed
        result.on_convert_report = self.owner.on_convert_report
        result.param_defs = self.param_defs
        result.template_content = self.template_content.copy()
        result.template_name = self.template_name
        for param_def in result.param_defs:
            param = Param(result, param_def)
            result.params.append(param)
        result.prepare_params()
        return  result

    def free(self):
        for p in self.params:
            p.field = None
        self.__dict__ = {}

    def print_report(self, param_values, url, ext=None, safe=False):
        if safe and not self.can_view():
            raise Exception(self.task.language('cant_view') % self.item_caption)
        copy = self.copy()
        copy.ext = ext
        result = copy.generate(param_values, url, ext)
        copy.free()
        return result

    def generate_file_name(self, ext=None):
        if not ext:
            ext = 'ods'
        file_name = self.item_name + '_' + datetime.datetime.now().strftime('%Y-%m-%d_%H:%M:%S.%f') + '.' + ext
        file_name = escape(file_name, {':': '-', '/': '_', '\\': '_'})
        return os.path.abspath(os.path.join(self.task.work_dir, 'static', 'reports', file_name))

    def generate(self, param_values, url, ext):
        self.extension = ext
        self.url = url
        template = self.template
        for i, param in enumerate(self.params):
            param.set_data(param_values[i]);
        if self.on_before_generate:
            self.on_before_generate(self)
        if template != self.template:
            self.template_content = None
        if self.template:
            if not self.template_content:
                self.parse_template()
            if self.on_parsed:
                self.on_parsed(self)
            self.content_name = os.path.join(self.task.work_dir, 'reports', 'content%s.xml' % time.time())
            self.content = open(self.content_name, 'wb')
            try:
                self.report_filename = self.generate_file_name()
                file_name = os.path.basename(self.report_filename)
                static_dir = os.path.dirname(self.report_filename)
                if not os.path.exists(static_dir):
                    os.makedirs(static_dir)
                self.content.write(self.template_content['header'])
                self.content.write(self.template_content['columns'])
                self.content.write(self.template_content['rows'])
                if self.on_generate:
                    self.on_generate(self)
                self.content.write(self.template_content['footer'])
                self.save()
            finally:
                try:
                    if not self.content.closed:
                        self.content.close()
                    if os.path.exists(self.content_name):
                        os.remove(self.content_name)
                except:
                    pass
            if ext and (ext != 'ods'):
                converted = False
                if self.on_convert_report:
                    try:
                        self.on_convert_report(self)
                        converted = True
                    except:
                        pass
                if not converted:
                    converted = self.task.convert_report(self, ext)
                converted_file = self.report_filename.replace('.ods', '.' + ext)
                if converted and os.path.exists(converted_file):
                    self.delete_report(self.report_filename)
                    file_name = file_name.replace('.ods', '.' + ext)
            self.report_filename = os.path.join(self.task.work_dir, 'static', 'reports', file_name)
            self.report_url = self.report_filename
            if self.url:
                self.report_url = os.path.join(self.url, 'static', 'reports', file_name)
        else:
            if self.on_generate:
                self.on_generate(self)
        if self.on_after_generate:
            self.on_after_generate(self)
        return self.report_url

    def delete_report(self, file_name):
        report_name = os.path.join(self.task.work_dir, 'static', 'reports', file_name)
        os.remove(report_name)

    def find(self, text, search, beg=None, end=None):
        return to_bytes(text, 'utf-8').find(to_bytes(search, 'utf-8'), beg, end)

    def rfind(self, text, search, beg=None, end=None):
        return to_bytes(text, 'utf-8').rfind(to_bytes(search, 'utf-8'), beg, end)

    def replace(self, text, find, replace):
        return to_bytes(text, 'utf-8').replace(to_bytes(find, 'utf-8'), to_bytes(replace, 'utf-8'))

    def parse_template(self):
        if not os.path.isabs(self.template):
            self.template_name = os.path.join(self.task.work_dir, 'reports', self.template)
        else:
            self.template_name = self.template
        z = zipfile.ZipFile(self.template_name, 'r')
        try:
            data = z.read('content.xml')
        finally:
            z.close()
        band_tags = []
        bands = {}
        colum_defs = []
        header = ''
        columns = ''
        rows = ''
        footer = ''
        repeated_rows = None
        if data:
            dom = parseString(data)
            try:
                tables = dom.getElementsByTagName('table:table')
                if len(tables) > 0:
                    table = tables[0]
                    for child in table.childNodes:
                        if child.nodeName == 'table:table-column':
                            repeated = child.getAttribute('table:number-columns-repeated')
                            if not repeated:
                                repeated = 1
                            colum_defs.append(['', repeated])
                        if child.nodeName == 'table:table-row':
                            repeated = child.getAttribute('table:number-rows-repeated')
                            if repeated and repeated.isdigit():
                                repeated_rows = to_bytes(repeated, 'utf-8')
                            for row_child in child.childNodes:
                                if row_child.nodeName == 'table:table-cell':
                                    text = row_child.getElementsByTagName('text:p')
                                    if text.length > 0:
                                        band_tags.append(text[0].childNodes[0].nodeValue)
                                    break
                start = 0
                columns_start = 0
                for col in colum_defs:
                    start = self.find(data, '<table:table-column', start)
                    if columns_start == 0:
                        columns_start = start
                    end = self.find(data, '/>', start)
                    col_text = data[start: end + 2]
                    columns = to_bytes('%s%s' % (columns, col_text), 'utf-8')
                    col[0] = data[start: end + 2]
                    start = end + 2
                columns_end = start
                header = data[0:columns_start]
                assert len(band_tags) > 0, 'No bands in the report template'
                positions = []
                start = 0
                for tag in band_tags:
                    text = '>%s<' % tag
                    i = self.find(data, text)
                    i = self.rfind(data, '<table:table-row', start, i)
                    positions.append(i)
                    start = i
                if repeated_rows and int(repeated_rows) > 1000:
                    i = self.find(data, repeated_rows)
                    i = self.rfind(data, '<table:table-row', start, i)
                    band_tags.append('$$$end_of_report')
                    positions.append(i)
                rows = data[columns_end:positions[0]]
                for i, tag in enumerate(band_tags):
                    start = positions[i]
                    try:
                        end = positions[i + 1]
                    except:
                        end = self.find(data, '</table:table>', start)
                    bands[tag] = self.replace(data[start: end], str(tag), '')
                footer = data[end:len(data)]
                self.template_content = {}
                self.template_content['bands'] = bands
                self.template_content['colum_defs'] = colum_defs
                self.template_content['header'] = header
                self.template_content['columns'] = columns
                self.template_content['rows'] = rows
                self.template_content['footer'] = footer
            finally:
                dom.unlink()
                del(dom)

    def hide_columns(self, col_list):

        def convert_str_to_int(string):
            s = string.upper()
            base = ord('A')
            mult = ord('Z') - base + 1
            result = s
            if type(s) == str:
                result = 0
                chars = []
                for i in range(len(s)):
                    chars.append(s[i])
                for i in range(len(chars) - 1, -1, -1):
                    result += (ord(chars[i]) - base + 1) * (mult ** (len(chars) - i - 1))
            return result

        def remove_repeated(col, repeated):
            result = col
            p = self.find(col, 'table:number-columns-repeated')
            if p != -1:
                r = self.find(col, str(repeated), p)
                if r != -1:
                    for i in range(r, 100):
                        if col[i] in ("'", '"'):
                            result = self.replace(col, col[p:i+1], '')
                            break
            return result

        if self.template_content:
            ints = []
            for i in col_list:
                ints.append(convert_str_to_int(i))
            colum_defs = self.template_content['colum_defs']
            columns = ''
            index = 1
            for col, repeated in colum_defs:
                repeated = int(repeated)
                if repeated > 1:
                    col = remove_repeated(col, repeated)
                for i in range(repeated):
                    cur_col = col
                    if index in ints:
                        cur_col = cur_col[0:-2] + ' table:visibility="collapse"/>'
                    columns += cur_col
                    index += 1
            self.template_content['colum_defs'] = colum_defs
            self.template_content['columns'] = columns

    def print_band(self, band, dic=None, update_band_text=None):
        text = self.template_content['bands'][band]
        if dic:
            d = dic.copy()
            for key, value in iteritems(d):
                if type(value) in string_types:
                    d[key] = escape(value)
            cell_start = 0
            cell_start_tag = to_bytes('<table:table-cell', 'utf-8')
            cell_type_tag = to_bytes('office:value-type="string"', 'utf-8')
            calcext_type_tag = to_bytes('calcext:value-type="string"', 'utf-8')
            start_tag = to_bytes('<text:p>', 'utf-8')
            end_tag = to_bytes('</text:p>', 'utf-8')
            while True:
                cell_start = self.find(text, cell_start_tag, cell_start)
                if cell_start == -1:
                    break
                else:
                    start = self.find(text, start_tag, cell_start)
                    if start != -1:
                        end = self.find(text, end_tag, start + len(start_tag))
                        if end != -1:
                            text_start = start + len(start_tag)
                            text_end = end
                            cell_text = text[text_start:text_end]
                            cell_text_start = self.find(cell_text, to_bytes('%(', 'utf-8'), 0)
                            if cell_text_start != -1:
                                end = self.find(cell_text, to_bytes(')s', 'utf-8'), cell_text_start + 2)
                                if end != -1:
                                    end += 2
                                    val = cell_text[cell_text_start:end]
                                    key = val[2:-2]
                                    value = d.get(to_unicode(key, 'utf-8'))
                                    if isinstance(value, DBField):
                                        raise Exception('Report: "%s" band: "%s" key "%s" a field object is passed. Specify the value attribute.' % \
                                            (self.item_name, band, key))
                                    elif not value is None:
                                        val = to_unicode(val, 'utf-8')
                                        val = val % d
                                        val = to_bytes(val, 'utf-8')
                                        if type(value) == float:
                                            val = self.replace(val, '.', common.DECIMAL_POINT)
                                    else:
                                        if not key in iterkeys(d):
                                            print('Report: "%s" band: "%s" key "%s" not found in the dictionary' % \
                                                (self.item_name, band, key))
                                    cell_text = to_bytes('%s%s%s', 'utf-8') % (cell_text[:cell_text_start], val, cell_text[end:])
                                    text = to_bytes('', 'utf-8').join([text[:text_start], cell_text, text[text_end:]])
                                    if type(value) in (int, float):
                                        start_text = text[cell_start:start]
                                        office_value = value
                                        start_text = self.replace(start_text, cell_type_tag, 'office:value-type="float" office:value="%s"' % office_value)
                                        start_text = self.replace(start_text, calcext_type_tag, 'calcext:value-type="float"')
                                        text = to_bytes('', 'utf-8').join([text[:cell_start], start_text, text[start:]])
                    cell_start += 1
            if update_band_text:
                text = update_band_text(text)
        self.content.write(text)

    def save(self):
        self.content.close()
        z = None
        self.zip_file = None
        try:
            self.zip_file = zipfile.ZipFile(self.report_filename, 'w', zipfile.ZIP_DEFLATED)
            z = zipfile.ZipFile(self.template_name, 'r')
            if self.on_before_save_report:
                self.on_before_save_report(self)
            for file_name in z.namelist():
                data = z.read(file_name)
                if file_name == 'content.xml':
                    self.zip_file.write(self.content_name, file_name)
                else:
                    self.zip_file.writestr(file_name, data)
        finally:
            if z:
                z.close()
            if self.zip_file:
                self.zip_file.close()

    def cur_to_str(self, value):
        return common.cur_to_str(value)

    def date_to_str(self, value):
        return common.date_to_str(value)

    def datetime_to_str(self, value):
        return common.datetime_to_str(value)

    def _set_modified(self, value):
        pass



class REPORT:

    def __init__(self, parent):
        self.parent = parent


    def generate(self):

        pass


    def __call__(self):

        return "report generator"


if __name__ == "__main__":

    r = REPORT('parent')
    r.generate()
    pass


