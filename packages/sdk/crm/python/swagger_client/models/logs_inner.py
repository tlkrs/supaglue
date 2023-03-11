# coding: utf-8

"""
    Supaglue CRM API

    # Introduction  Welcome to the Supaglue unified CRM API documentation. You can use this API to read data that has been synced into Supaglue from third-party providers.  ### Base API URL  ``` http://localhost:8080/api/crm/v1 ```   # noqa: E501

    OpenAPI spec version: 0.3.3
    Contact: docs@supaglue.com
    Generated by: https://github.com/swagger-api/swagger-codegen.git
"""

import pprint
import re  # noqa: F401

import six

class LogsInner(object):
    """NOTE: This class is auto generated by the swagger code generator program.

    Do not edit the class manually.
    """
    """
    Attributes:
      swagger_types (dict): The key is attribute name
                            and the value is attribute type.
      attribute_map (dict): The key is attribute name
                            and the value is json key in definition.
    """
    swagger_types = {
        'dashboard_view': 'str',
        'log_id': 'str',
        'log_summary': 'object'
    }

    attribute_map = {
        'dashboard_view': 'dashboard_view',
        'log_id': 'log_id',
        'log_summary': 'log_summary'
    }

    def __init__(self, dashboard_view=None, log_id=None, log_summary=None):  # noqa: E501
        """LogsInner - a model defined in Swagger"""  # noqa: E501
        self._dashboard_view = None
        self._log_id = None
        self._log_summary = None
        self.discriminator = None
        if dashboard_view is not None:
            self.dashboard_view = dashboard_view
        if log_id is not None:
            self.log_id = log_id
        if log_summary is not None:
            self.log_summary = log_summary

    @property
    def dashboard_view(self):
        """Gets the dashboard_view of this LogsInner.  # noqa: E501


        :return: The dashboard_view of this LogsInner.  # noqa: E501
        :rtype: str
        """
        return self._dashboard_view

    @dashboard_view.setter
    def dashboard_view(self, dashboard_view):
        """Sets the dashboard_view of this LogsInner.


        :param dashboard_view: The dashboard_view of this LogsInner.  # noqa: E501
        :type: str
        """

        self._dashboard_view = dashboard_view

    @property
    def log_id(self):
        """Gets the log_id of this LogsInner.  # noqa: E501


        :return: The log_id of this LogsInner.  # noqa: E501
        :rtype: str
        """
        return self._log_id

    @log_id.setter
    def log_id(self, log_id):
        """Sets the log_id of this LogsInner.


        :param log_id: The log_id of this LogsInner.  # noqa: E501
        :type: str
        """

        self._log_id = log_id

    @property
    def log_summary(self):
        """Gets the log_summary of this LogsInner.  # noqa: E501


        :return: The log_summary of this LogsInner.  # noqa: E501
        :rtype: object
        """
        return self._log_summary

    @log_summary.setter
    def log_summary(self, log_summary):
        """Sets the log_summary of this LogsInner.


        :param log_summary: The log_summary of this LogsInner.  # noqa: E501
        :type: object
        """

        self._log_summary = log_summary

    def to_dict(self):
        """Returns the model properties as a dict"""
        result = {}

        for attr, _ in six.iteritems(self.swagger_types):
            value = getattr(self, attr)
            if isinstance(value, list):
                result[attr] = list(map(
                    lambda x: x.to_dict() if hasattr(x, "to_dict") else x,
                    value
                ))
            elif hasattr(value, "to_dict"):
                result[attr] = value.to_dict()
            elif isinstance(value, dict):
                result[attr] = dict(map(
                    lambda item: (item[0], item[1].to_dict())
                    if hasattr(item[1], "to_dict") else item,
                    value.items()
                ))
            else:
                result[attr] = value
        if issubclass(LogsInner, dict):
            for key, value in self.items():
                result[key] = value

        return result

    def to_str(self):
        """Returns the string representation of the model"""
        return pprint.pformat(self.to_dict())

    def __repr__(self):
        """For `print` and `pprint`"""
        return self.to_str()

    def __eq__(self, other):
        """Returns true if both objects are equal"""
        if not isinstance(other, LogsInner):
            return False

        return self.__dict__ == other.__dict__

    def __ne__(self, other):
        """Returns true if both objects are not equal"""
        return not self == other